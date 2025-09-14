import { ApiProperty } from '@nestjs/swagger';

export class SignupResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  full_name: string | null;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  verification_status: string;

  @ApiProperty()
  message: string;

  @ApiProperty({ required: false })
  otp_debug?: string;
}

export class VerifyEmailResponseDto {
  @ApiProperty()
  message: string;
}

export class ResendOtpResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  expiresAt: Date;
}
