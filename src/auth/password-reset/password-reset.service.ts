import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as crypto from 'crypto';
import { getPasswordHash } from 'src/utils/auth';
import { comparePasswordResetToken } from 'src/utils/token-hashing';
import { MailService } from 'src/mailer/mailer.service';
@Injectable()
export class PasswordResetService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async generateResetToken(): Promise<{ token: string; hashedToken: string }> {
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = await getPasswordHash(token);
    return { token, hashedToken };
  }

  async requestPasswordReset(email: string): Promise<string> {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return 'If the email exists, a reset link will be sent to your email';
    }

    const { token, hashedToken } = await this.generateResetToken();

    if (user) {
      await this.prisma.passwordResetToken.deleteMany({
        where: { email },
      });

      // Save token to database with expiration
      await this.prisma.passwordResetToken.create({
        data: {
          email,
          token: hashedToken,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        },
      });
    }

    //send email
    const emailSent = await this.mailService.sendPasswordResetEmail(
      user.email,
      token,
    );

    if (!emailSent) {
      throw new BadRequestException('Failed to send password reset email');
    }

    return 'If the email exists, a reset link will be sent to your email';
  }

  async validateResetToken(token: string): Promise<string> {
    // Check if token exists in database and is not expired
    const resetToken = await this.prisma.passwordResetToken.findFirst({
      where: {
        expiresAt: { gt: new Date() },
      },
    });

    if (
      !resetToken ||
      !(await comparePasswordResetToken(token, resetToken.token))
    ) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Now we can find the user since the token is valid
    const user = await this.prisma.user.findUnique({
      where: { email: resetToken.email },
    });

    if (!user) {
      throw new BadRequestException('Invalid reset token');
    }

    return user.id;
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      console.log('token', token);
      // Validate the token and get the user ID
      const userId = await this.validateResetToken(token);

      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { email: true },
      });

      if (!user) {
        throw new BadRequestException('User not found.');
      }

      const hashedPassword = await getPasswordHash(newPassword);

      // Update the user's password and delete the token in a single transaction
      await this.prisma.$transaction([
        this.prisma.password.update({
          where: { userId },
          data: {
            hash: hashedPassword,
          },
        }),
        this.prisma.passwordResetToken.deleteMany({
          where: { email: user.email },
        }),
      ]);

      // Optional: Invalidate user sessions
      // You can add this logic back if you have a session model
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Password reset failed.');
    }
  }

  async cleanupExpiredTokens(): Promise<void> {
    await this.prisma.passwordResetToken.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });
  }
}
