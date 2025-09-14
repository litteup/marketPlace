import {
  ApiExtraModels,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { ProductStatus } from './get-product.dto';
import {
  ApiResponseDto,
  PaginatedResponseDto,
} from 'src/common/utils/response.util';

export class ProductDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  category: string;

  @ApiProperty()
  categoryId: string;

  @ApiProperty()
  country: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  street: string;

  @ApiPropertyOptional({ type: Date, nullable: true })
  urgencyEndsAt?: Date | null;

  @ApiProperty({ type: [String] })
  imageUrls: string[];

  @ApiProperty({ enum: ProductStatus })
  status: ProductStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  sellerId: string;

  @ApiPropertyOptional()
  sellerName?: string;

  constructor(partial: Partial<ProductDto>) {
    Object.assign(this, partial);
  }
}

@ApiExtraModels(ProductDto)
export class ProductResponseDto extends ApiResponseDto<ProductDto> {
  @ApiProperty({ type: () => ProductDto })
  declare data: ProductDto;
}

@ApiExtraModels(ProductDto)
export class PaginatedProductResponseDto extends PaginatedResponseDto<ProductDto> {
  @ApiProperty({ type: () => [ProductDto] })
  declare data: ProductDto[];
}
