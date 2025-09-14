import { Prisma } from '@prisma/client';
import { GetCategoryDto } from 'src/admin/category/dto/get-category.dto';

export class CategoryFilterUtil {
  static buildWhereClause(
    filters: GetCategoryDto,
    additionalWhere?: Prisma.CategoryWhereInput,
  ): Prisma.CategoryWhereInput {
    const where: Prisma.CategoryWhereInput = {};

    // Add search filter
    if (filters.search) {
      where.name = {
        contains: filters.search,
        mode: 'insensitive',
      };
    }

    // Merge with additional where conditions
    if (additionalWhere) {
      return { ...where, ...additionalWhere };
    }

    return where;
  }

  static getPaginationParams(filters: GetCategoryDto) {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;
    const take = limit;

    return { skip, take, page, limit };
  }
}
