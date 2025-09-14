import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
  IsDateString,
  MaxLength,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DESCRIPTION_MAX_LENGTH, TITLE_MAX_LENGTH } from './update-product.dto';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product title',
    example: 'Brand new iPhone 15',
    maxLength: TITLE_MAX_LENGTH,
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Detailed product description',
    example: 'This is a brand new iPhone 15, unopened.',
    maxLength: DESCRIPTION_MAX_LENGTH,
    required: false,
  })
  @IsString()
  @MaxLength(DESCRIPTION_MAX_LENGTH, { message: 'Description is too long' })
  description: string;

  @ApiProperty({
    description: 'Product price',
    example: 999.99,
    required: false,
  })
  @IsNumber({}, { message: 'Price must be a number' })
  price: number;

  @ApiProperty({
    description: 'When the urgency for this product ends',
    example: '2025-12-31T23:59:59.000Z',
    required: false,
  })
  @IsDateString()
  urgencyEndsAt: string;

  @ApiProperty({
    description: 'List of product image URLs',
    example: ['https://example.com/img1.jpg', 'https://example.com/img2.jpg'],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  imageUrls: string[];

  @ApiProperty({
    description: 'Country',
    example: 'Nigeria',
    required: false,
  })
  @IsString()
  country: string;

  @ApiProperty({
    description: 'State',
    example: 'Lagos',
    required: false,
  })
  @IsOptional()
  state: string;

  @ApiProperty({
    description: 'City',
    example: 'Ikeja',
    required: false,
  })
  @IsString()
  city: string;

  @ApiProperty({
    description: 'Street',
    example: 'Allen Avenue',
    required: false,
  })
  @IsString()
  street: string;

  @ApiProperty({
    description: 'Category ID',
    example: 'c123-uuid-of-category',
    required: false,
  })
  @IsUUID('4', { message: 'Invalid categoryId format' })
  categoryId: string;
}
