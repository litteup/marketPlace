import { ProductStatus } from 'src/product/dto/get-product.dto';
import { ProductDto } from 'src/product/dto/product-response.dto';

export function mapProductToResponseDto(product: any): ProductDto {
  return new ProductDto({
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price,
    category: product.category?.name || '',
    categoryId: product.categoryId,
    country: product.country,
    state: product.state,
    city: product.city,
    street: product.street,
    urgencyEndsAt: product.urgencyEndsAt,
    imageUrls: product.imageUrls,
    status: product.status as ProductStatus,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    sellerId: product.userId,
    sellerName: product?.user?.full_name || '',
  });
}
