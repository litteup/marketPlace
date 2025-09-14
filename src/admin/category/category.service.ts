import { FilterUtil } from 'src/common/utils/filter.utils';
import { ResponseUtil } from 'src/common/utils/response.util';
import { PrismaService } from 'src/prisma/prisma.service';

import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { GetCategoryDto } from './dto/get-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}
  async create(createCategoryDto: Prisma.CategoryCreateInput) {
    try {
      const { id, name, percentageFee } = await this.prisma.category.create({
        data: {
          ...createCategoryDto,
          name: createCategoryDto.name.toLowerCase(),
        },
      });

      return ResponseUtil.created(
        { id, name, percentageFee },
        'Category created successfully',
      );
    } catch (error) {
      console.error('Category creation failed:', error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Category with this name already exists');
        }
      }

      throw new InternalServerErrorException('Failed to create category');
    }
  }

  async update(
    categoryId: Prisma.CategoryWhereUniqueInput,
    updateCategoryDto: Prisma.CategoryUpdateInput,
  ) {
    try {
      // Check if category exists first
      const existingCategory = await this.prisma.category.findUnique({
        where: categoryId,
      });

      if (!existingCategory) {
        throw new NotFoundException(
          `Category with ID ${categoryId.id} not found`,
        );
      }

      // Ensure name is lowercase if provided
      if (
        updateCategoryDto.name &&
        typeof updateCategoryDto.name === 'string'
      ) {
        updateCategoryDto.name = updateCategoryDto.name.toLowerCase();
      }

      const updatedCategory = await this.prisma.category.update({
        data: updateCategoryDto,
        where: categoryId,
        select: {
          id: true,
          name: true,
          percentageFee: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return ResponseUtil.updated(
        updatedCategory,
        'Category updated successfully',
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Category with this name already exists');
        }
        if (error.code === 'P2025') {
          throw new NotFoundException('Category not found');
        }
      }

      throw new InternalServerErrorException('Failed to update category');
    }
  }

  /**
   * Get all categories with optional search
   */
  async findAll(
    filters: GetCategoryDto,
    additionalWhere?: Prisma.CategoryWhereInput,
  ) {
    try {
      const { skip, take, page, limit } = FilterUtil.getPaginationParams(
        filters.page,
        filters.limit,
      );

      const where = this.buildCategoryWhereClause(filters, additionalWhere);

      const [categories, total] = await Promise.all([
        this.prisma.category.findMany({
          where,
          orderBy: { name: 'desc' },
          skip,
          take,
          select: {
            id: true,
            name: true,
            percentageFee: true,
            createdAt: true,
            updatedAt: true,
            _count: {
              select: {
                products: {
                  where: { status: 'ACTIVE' },
                },
              },
            },
          },
        }),
        this.prisma.category.count({ where }),
      ]);

      const formattedCategories = categories.map((category) => ({
        id: category.id,
        name: category.name,
        percentageFee: category.percentageFee,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
        productCount: category._count.products,
      }));

      return ResponseUtil.paginated(
        formattedCategories,
        total,
        page,
        limit,
        'Categories retrieved successfully',
      );
    } catch (error) {
      console.error('Failed to fetch categories:', error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2021') {
          throw new InternalServerErrorException(
            'Database table does not exist',
          );
        }
      }

      throw new InternalServerErrorException('Failed to fetch categories');
    }
  }

  /**
   * Get a single category by ID
   */
  async findOne(id: string) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id },
        include: {
          _count: { select: { products: { where: { status: 'ACTIVE' } } } },
        },
      });
      if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }

      const formattedCategory = {
        id: category.id,
        name: category.name,
        percentageFee: category.percentageFee,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
        productCount: category._count.products,
      };

      return ResponseUtil.success(
        formattedCategory,
        'Category retrieved successfully',
      );
    } catch (error) {
      console.error('Failed to fetch category:', error);

      if (error instanceof NotFoundException) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2023') {
          throw new BadRequestException('Invalid category ID format');
        }
      }

      throw new InternalServerErrorException('Failed to fetch category');
    }
  }

  /**
   * Delete a category
   */
  async remove(id: string) {
    try {
      // Check if category exists
      const category = await this.prisma.category.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
        },
      });

      if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }

      // Check if category has active products
      const activeProductsCount = await this.prisma.product.count({
        where: {
          categoryId: id,
          status: 'ACTIVE',
        },
      });

      if (activeProductsCount > 0) {
        throw new BadRequestException(
          `Cannot delete category '${category.name}' because it has ${activeProductsCount} active product(s). Please move or deactivate the products first.`,
        );
      }
      await this.prisma.category.delete({
        where: { id },
      });
      return ResponseUtil.deleted(
        `Category '${category.name}' deleted successfully`,
      );
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Category not found');
        }
      }

      throw new InternalServerErrorException('Failed to delete category');
    }
  }

  private buildCategoryWhereClause(
    filters: GetCategoryDto,
    additionalWhere?: Prisma.CategoryWhereInput,
  ): Prisma.CategoryWhereInput {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { search, page, limit, ...restFilters } = filters;
    const where: Prisma.CategoryWhereInput = { ...additionalWhere };

    // Search filter
    if (search) {
      where.OR = [{ name: { contains: search, mode: 'insensitive' } }];
    }

    // Add other filters if needed
    Object.keys(restFilters).forEach((key) => {
      if (restFilters[key] !== undefined && restFilters[key] !== null) {
        where[key] = restFilters[key];
      }
    });

    return where;
  }
}
