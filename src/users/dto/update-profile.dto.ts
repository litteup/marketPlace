import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsPhoneNumber, Length } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @Length(2, 50)
  @ApiProperty({
    description: 'user name',
    example: 'john doe',
  })
  full_name?: string;

  @ApiProperty({
    description: 'user phone number',
    example: '+2348045673456',
  })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @ApiProperty({
    description: 'user profile image',
    example: 'https://www.image-url.com',
  })
  @IsOptional()
  @IsString()
  profile_picture?: string;
}
