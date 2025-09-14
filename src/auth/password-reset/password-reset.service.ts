import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as crypto from 'crypto';
import { getPasswordHash } from 'src/utils/auth';
import { MailService } from 'src/mailer/mailer.service';
import {
  comparePasswordResetToken,
  hashResetToken,
} from 'src/utils/token-hashing';
import { ChangePasswordDto } from './dto/change-password.dto';

export type PasswordResetToken = {
  id: string;
  email: string;
  token: string;
  createdAt: Date;
  expiresAt: Date;
};
@Injectable()
export class PasswordResetService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async generateResetToken(): Promise<{ token: string; hashedToken: string }> {
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = await hashResetToken(token);
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
          expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
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

  async validateResetToken(
    token: string,
  ): Promise<{ userId: string; email: string }> {
    // Get all non-expired tokens
    const resetTokens = await this.prisma.passwordResetToken.findMany({
      where: {
        expiresAt: { gt: new Date() },
      },
    });

    if (resetTokens.length === 0) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Find the token that matches the provided token
    let validToken: PasswordResetToken | null = null;
    for (const resetToken of resetTokens) {
      const isValid = await comparePasswordResetToken(token, resetToken.token);
      if (isValid) {
        validToken = resetToken;
        break;
      }
    }

    if (!validToken) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Find the user associated with this token
    const user = await this.prisma.user.findUnique({
      where: { email: validToken.email },
    });

    if (!user) {
      throw new BadRequestException('Invalid reset token');
    }

    return { userId: user.id, email: validToken.email };
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const { userId, email } = await this.validateResetToken(token);

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
          where: { email },
        }),
      ]);
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Password reset failed.');
    }
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const { new_password } = changePasswordDto;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        full_name: true,
        password: true,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const hashedPassword = await getPasswordHash(new_password);

    if (user.password) {
      //update existing password
      await this.prisma.password.update({
        where: { userId },
        data: {
          hash: hashedPassword,
        },
      });
    } else {
      //create a password record
      await this.prisma.password.create({
        data: {
          hash: hashedPassword,
          userId: user.id,
        },
      });
    }
    //send email
    try {
      const emailSent = await this.mailService.sendPasswordChangeEmail(
        user.email,
        user.full_name || 'There',
      );

      if (!emailSent) {
        console.warn(`Failed to send password change email to ${user.email}`);
      }
    } catch (error) {
      console.error('Error sending password change email:', error);
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
