import { IsEmail, IsEnum } from 'class-validator';

import { OtpType } from '../otp.types';

export class SendOtpDto {
  @IsEmail()
  email: string;

  @IsEnum(['SIGNUP', 'EMAIL_VERIFICATION', 'FORGOT_PASSWORD', 'RESET_PASSWORD'])
  type: OtpType;
}
