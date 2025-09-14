import { Prisma } from '@prisma/client';
import { GetProductsDto } from 'src/product/dto/get-product.dto';

export interface BaseFilterDto {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class FilterUtil {
  // ========== GENERIC METHODS ==========

  static getPaginationParams(page?: number, limit?: number) {
    const pageNumber = page && page > 0 ? page : 1;
    const limitNumber = limit && limit > 0 ? limit : 10;
    const skip = (pageNumber - 1) * limitNumber;

    return {
      skip,
      take: limitNumber,
      page: pageNumber,
      limit: limitNumber,
    };
  }

  static buildSearchFilter(search?: string, searchFields: string[] = []) {
    if (!search || searchFields.length === 0) return undefined;

    return {
      OR: searchFields.map((field) => ({
        [field]: { contains: search, mode: 'insensitive' },
      })),
    };
  }

  static buildRangeFilter(min?: number, max?: number, field: string = 'price') {
    if (min === undefined && max === undefined) return undefined;

    const rangeFilter: any = {};
    if (min !== undefined) rangeFilter.gte = min;
    if (max !== undefined) rangeFilter.lte = max;

    return { [field]: rangeFilter };
  }

  static buildEqualsFilter(value?: string, field: string = 'status') {
    if (!value) return undefined;
    return { [field]: { equals: value, mode: 'insensitive' } };
  }

  static buildOrderBy(
    sortBy?: string,
    sortOrder: 'asc' | 'desc' = 'desc',
    defaultField: string = 'createdAt',
  ) {
    if (sortBy) {
      return { [sortBy]: sortOrder };
    }
    return { [defaultField]: 'desc' };
  }

  // ========== PRODUCT-SPECIFIC METHODS (keeping your existing code) ==========

  static buildProductWhereClause(
    filters: GetProductsDto,
    additionalWhere?: Prisma.ProductWhereInput,
  ) {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      country,
      state,
      city,
      status,
    } = filters;

    const where: Prisma.ProductWhereInput = {
      ...additionalWhere,
    };

    // Handle status filter
    if (status && status !== 'ALL') {
      where.status = status;
    }

    // Search filter
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Category filter
    if (category) {
      where.category = {
        name: { equals: category, mode: 'insensitive' },
      };
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    // Location filters
    if (country) where.country = { equals: country, mode: 'insensitive' };
    if (state) where.state = { equals: state, mode: 'insensitive' };
    if (city) where.city = { equals: city, mode: 'insensitive' };

    return where;
  }

  static buildProductOrderByClause(filters: GetProductsDto) {
    const { sortByPrice, sortByDate } = filters;

    const orderBy: Prisma.ProductOrderByWithRelationInput[] = [];

    if (sortByPrice) {
      orderBy.push({ price: sortByPrice });
    }

    if (sortByDate) {
      orderBy.push({ createdAt: sortByDate });
    }

    // Default sorting by creation date if no sort specified
    if (orderBy.length === 0) {
      orderBy.push({ createdAt: 'desc' });
    }

    return orderBy;
  }

  // ========== GENERIC BUILDERS FOR OTHER ENTITIES ==========

  static buildGenericWhereClause<T extends BaseFilterDto>(
    filters: T,
    options: {
      searchFields?: string[];
      rangeFilters?: { field: string; min?: number; max?: number }[];
      equalsFilters?: { field: string; value?: string }[];
      additionalWhere?: any;
    } = {},
  ) {
    const {
      searchFields = [],
      rangeFilters = [],
      equalsFilters = [],
      additionalWhere = {},
    } = options;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { search, page, limit, sortBy, sortOrder, ...restFilters } = filters;

    const where: any = { ...additionalWhere };

    // Search filter
    const searchFilter = this.buildSearchFilter(search, searchFields);
    if (searchFilter) {
      where.OR = searchFilter.OR;
    }

    // Range filters
    rangeFilters.forEach(({ field, min, max }) => {
      const rangeFilter = this.buildRangeFilter(min, max, field);
      if (rangeFilter) {
        where[field] = rangeFilter[field];
      }
    });

    // Equals filters
    equalsFilters.forEach(({ field, value }) => {
      const equalsFilter = this.buildEqualsFilter(value, field);
      if (equalsFilter) {
        where[field] = equalsFilter[field];
      }
    });

    // Add other simple filters (string, number, boolean)
    Object.keys(restFilters).forEach((key) => {
      if (restFilters[key] !== undefined && restFilters[key] !== null) {
        where[key] = restFilters[key];
      }
    });

    return where;
  }
}
