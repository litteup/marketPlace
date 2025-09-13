import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'test@example.com',
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    example: '123456',
  })
  code: string;
}

export class ResendEmailDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'test@example.com',
  })
  email: string;
}
