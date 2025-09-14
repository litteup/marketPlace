import { ApiProperty } from '@nestjs/swagger';
import { ProductStatus } from './get-product.dto';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class ProductStatusDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: ProductStatus.ACTIVE,
    description: 'User product status',
    enum: [ProductStatus.ACTIVE, ProductStatus.INACTIVE],
  })
  @IsEnum(ProductStatus, { message: 'Status must be ACTIVE or INACTIVE' })
  status: ProductStatus.ACTIVE | ProductStatus.INACTIVE;
}
