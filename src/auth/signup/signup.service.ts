import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { MailService } from 'src/mailer/mailer.service';
import { OtpService } from 'src/mailer/otp.service';
import { OtpType } from 'src/mailer/otp.types';

import { UsersService } from 'src/users/users.service';
import { SignupResponseDto } from './dto/signup-response.dto';

@Injectable()
export class SignupService {
  private readonly logger = new Logger(SignupService.name);

  constructor(
    private usersService: UsersService,
    private otpService: OtpService,
    private mailService: MailService,
  ) {}

  async signup(data: Prisma.UserCreateInput): Promise<SignupResponseDto> {
    try {
      const existingUser = await this.usersService.findOneByEmail(data.email);

      if (existingUser) {
        if (existingUser.email === data.email) {
          throw new ConflictException('User with this email already exists');
        }
      }

      // Create user with unverified status
      const { id, full_name, email, role, verification_status } =
        await this.usersService.create(data);

      let message: string;
      let otpDebugCode: string | undefined;

      try {
        // Generate OTP
        const otpResult = await this.otpService.generateOtp(
          email,
          OtpType.EMAIL_VERIFICATION,
          { debug: true }, // Enable debug to get the code
        );

        otpDebugCode = otpResult.code;

        // Send OTP email
        const emailSent = await this.mailService.sendOtpEmail(
          email,
          otpResult.code,
        );

        if (emailSent) {
          message = `User registered successfully. OTP sent to ${email}.`;
        } else {
          message = `User registered but email failed. Debug OTP: ${otpDebugCode}`;
        }
      } catch (error) {
        this.logger.error('OTP processing failed:', error);
        message =
          'User registered but OTP processing failed. Please try again.';
      }

      const response: SignupResponseDto = {
        id,
        full_name,
        email,
        role,
        verification_status,
        message,
      };

      // Only include debug code in development
      if (otpDebugCode && process.env.NODE_ENV !== 'production') {
        response.otp_debug = otpDebugCode;
      }

      return response;
    } catch (error) {
      this.logger.error('Signup failed:', error);

      if (error instanceof ConflictException) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('User with this email already exists');
        }
      }

      throw new InternalServerErrorException(
        'Signup failed. Please try again.',
      );
    }
  }

  // verify email with OTP
  async verifyEmail(email: string, code: string): Promise<{ message: string }> {
    try {
      await this.otpService.verifyOtp(email, code, OtpType.EMAIL_VERIFICATION);

      return { message: 'Email verified successfully' };
    } catch (error) {
      throw new InternalServerErrorException(
        'Email verification failed: ' + error.message,
      );
    }
  }

  //resend OTP
  async resendOtp(
    email: string,
  ): Promise<{ message: string; expiresAt: Date }> {
    try {
      // Generate new OTP
      const otpResult = await this.otpService.generateOtp(
        email,
        OtpType.EMAIL_VERIFICATION,
      );

      // Send email
      await this.mailService.sendOtpEmail(email, otpResult.code);

      return {
        message: `OTP resent to ${email}`,
        expiresAt: otpResult.expiresAt,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to resend OTP: ' + error.message,
      );
    }
  }
}
