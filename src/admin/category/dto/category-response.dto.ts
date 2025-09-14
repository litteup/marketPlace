import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import {
  ApiResponseDto,
  PaginatedResponseDto,
} from 'src/common/utils/response.util';

export class CategoryDto {
  @ApiProperty({
    description: 'Category ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Category name',
    example: 'Electronics',
  })
  name: string;

  @ApiProperty({
    description: 'Percentage fee for the category',
    example: 5.5,
  })
  percentageFee: number;

  @ApiProperty({
    description: 'Category creation date',
    example: '2023-12-01T10:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Category last update date',
    example: '2023-12-01T10:00:00Z',
  })
  updatedAt: Date;
}

export class DeleteCategoryResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Category deleted successfully' })
  message: string;
}

export class ErrorResponseDto {
  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({ example: 'Error message' })
  message: string;
}

@ApiExtraModels(CategoryDto)
export class CategoryResponseDto extends ApiResponseDto<CategoryDto> {
  @ApiProperty({ type: () => CategoryDto })
  declare data: CategoryDto;
}

@ApiExtraModels(CategoryDto)
export class PaginatedCategoryResponseDto extends PaginatedResponseDto<CategoryDto> {
  @ApiProperty({ type: () => [CategoryDto] })
  declare data: CategoryDto[];
}
