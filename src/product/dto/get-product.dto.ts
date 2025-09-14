// src/products/dto/get-products.dto.ts
import {
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum ProductStatus {
  ALL = 'ALL',
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  EXPIRED = 'EXPIRED',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class GetProductsDto {
  @ApiPropertyOptional({
    description: 'Search by product title or description',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by category' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Filter by minimum price' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Filter by maximum price' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({ description: 'Filter by country' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ description: 'Filter by state' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ description: 'Filter by city' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    enum: [...Object.values(ProductStatus), 'ALL'],
    description:
      'Filter by product status. Use "ALL" to get products with any status',
    default: ProductStatus.ACTIVE,
    example: ProductStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum([...Object.values(ProductStatus), 'ALL'], {
    message: 'Status must be a valid ProductStatus or "ALL"',
  })
  status?: ProductStatus | 'ALL' = ProductStatus.ACTIVE;

  @ApiPropertyOptional({ enum: SortOrder, description: 'Sort order for price' })
  @IsOptional()
  @IsEnum(SortOrder)
  sortByPrice?: SortOrder;

  @ApiPropertyOptional({
    enum: SortOrder,
    description: 'Sort order for creation date',
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortByDate?: SortOrder;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    default: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = 1; // Remove optional indicator and add default value

  @ApiPropertyOptional({
    description: 'Number of items per page',
    default: 10,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit: number = 10; // Remove optional indicator and add default value
}
