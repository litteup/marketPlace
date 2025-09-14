// src/product/product-base.service.ts
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetProductsDto } from './dto/get-product.dto';
import { FilterUtil } from 'src/common/utils/filter.utils';
import { Prisma } from '@prisma/client';
import { ResponseUtil } from 'src/common/utils/response.util';
import { mapProductToResponseDto } from 'src/utils/product-mapper';

@Injectable()
export class ProductBaseService {
  constructor(private prisma: PrismaService) {}

  async findProducts(
    filters: GetProductsDto,
    additionalWhere?: Prisma.ProductWhereInput,
  ) {
    const { skip, take, page, limit } = FilterUtil.getPaginationParams(
      filters.page,
      filters.limit,
    );

    const where = FilterUtil.buildProductWhereClause(filters, additionalWhere);
    const orderBy = FilterUtil.buildProductOrderByClause(filters);

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          user: {
            select: {
              id: true,
              full_name: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    // Map products to response DTOs
    const productDtos = products.map((product) =>
      mapProductToResponseDto(product),
    );

    return ResponseUtil.paginated(productDtos, total, page, limit);
  }

  async validateProductOwnership(
    productId: string,
    userId: string,
  ): Promise<void> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.userId !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to perform this action',
      );
    }
  }
}
