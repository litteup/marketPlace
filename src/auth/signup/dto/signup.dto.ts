import {
  Matches,
  IsEmail,
  IsString,
  MinLength,
  IsNotEmpty,
  IsPhoneNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @ApiProperty({
    example: 'John Doe',
  })
  full_name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'test@example.com',
  })
  email: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: '+2348023232313',
  })
  phone: string;

  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must contain uppercase, lowercase, and number/special character',
  })
  @ApiProperty({
    example: 'Test1234@',
  })
  password: string;
}
