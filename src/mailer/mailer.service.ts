import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendPasswordResetEmail(email: string, token: string) {
    const url = `${process.env.RESET_LINK_URL}/?token=${token}`;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Password Reset Request',
        template: './password-reset',
        context: {
          name: email,
          url,
        },
      });
      return true;
    } catch (error) {
      console.error('Failed to send reset email', error);
      return false;
    }
  }

  async sendOtpEmail(email: string, otp: string): Promise<boolean> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Your Account Verification OTP',
        template: './otp',
        context: {
          email,
          otp,
          expiryMinutes: process.env.OTP_EXP_MINUTES || 5,
        },
      });
      return true;
    } catch (error) {
      console.error('Failed to send OTP email', error);
      return false;
    }
  }
}
