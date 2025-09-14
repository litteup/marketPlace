import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length, IsBoolean } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(2, 50)
  @ApiProperty({
    description: 'Full name of the user',
    required: false,
    example: 'John Doe',
  })
  full_name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Role of the user (user, admin, seller)',
    required: false,
    example: 'seller',
  })
  role?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Verification status of the user',
    required: false,
    example: 'verified',
  })
  verification_status?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Whether the user has a seller badge',
    required: false,
    example: true,
  })
  seller_badge?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Whether the user account is active',
    required: false,
    example: false,
  })
  active?: boolean;
}
