import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  MaxLength,
  IsNumber,
  IsArray,
  IsDateString,
  IsUUID,
} from 'class-validator';

export const TITLE_MAX_LENGTH = 300;
export const DESCRIPTION_MAX_LENGTH = 2000;

export class UpdateProductDto {
  @ApiPropertyOptional({
    description: 'Product title',
    example: 'Brand new iPhone 15',
    maxLength: TITLE_MAX_LENGTH,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(TITLE_MAX_LENGTH, { message: 'Title is too long' })
  title?: string;

  @ApiPropertyOptional({
    description: 'Detailed product description',
    example: 'This is a brand new iPhone 15, unopened.',
    maxLength: DESCRIPTION_MAX_LENGTH,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(DESCRIPTION_MAX_LENGTH, { message: 'Description is too long' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Product price',
    example: 999.99,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Price must be a number' })
  price?: number;

  @ApiPropertyOptional({
    description: 'When the urgency for this product ends',
    example: '2025-12-31T23:59:59.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  urgencyEndsAt?: string;

  @ApiPropertyOptional({
    description: 'List of product image URLs',
    example: ['https://example.com/img1.jpg', 'https://example.com/img2.jpg'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];

  @ApiPropertyOptional({
    description: 'Country',
    example: 'Nigeria',
    required: false,
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({
    description: 'State',
    example: 'Lagos',
    required: false,
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({
    description: 'City',
    example: 'Ikeja',
    required: false,
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    description: 'Street',
    example: 'Allen Avenue',
    required: false,
  })
  @IsOptional()
  @IsString()
  street?: string;

  @ApiPropertyOptional({
    description: 'Category ID',
    example: 'c123-uuid-of-category',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'Invalid categoryId format' })
  categoryId: string;
}
