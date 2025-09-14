import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'jane@example.com', description: 'User email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'StrongPassword123', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({
    example: 'Jane Doe',
    required: false,
    description: 'Full name of the user',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Full name cannot be empty if provided' })
  full_name?: string;

  @ApiProperty({
    example: 'admin',
    required: false,
    description: 'User role (defaults to "user")',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Role cannot be empty if provided' })
  role?: string;

  @ApiProperty({
    example: '+2348039393939',
    required: false,
    description: 'Phone number of the user',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Phone cannot be empty if provided' })
  phone?: string;
}
