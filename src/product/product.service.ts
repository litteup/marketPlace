import { ResponseUtil } from 'src/common/utils/response.util';
import { PrismaService } from 'src/prisma/prisma.service';
import { mapProductToResponseDto } from 'src/utils/product-mapper';

import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

import { CreateProductDto } from './dto/create-product.dto';
import { GetProductsDto, ProductStatus } from './dto/get-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductBaseService } from './product-base.service';

const prisma = new PrismaClient();

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private productBaseService: ProductBaseService,
  ) {}

  //create product
  async createProduct(dto: CreateProductDto, userId: string) {
    try {
      const product = await prisma.product.create({
        data: {
          ...dto,
          userId,
        },
      });

      return ResponseUtil.created(product, 'Product created successfully');
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException(
            'Product with similar details already exists',
          );
        }
      }
      throw new InternalServerErrorException('Failed to create product');
    }
  }

  //delete product
  async deleteProduct(userId: string, productId: string) {
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) throw new NotFoundException('Product not found');
      if (product.userId !== userId)
        throw new UnauthorizedException('Not allowed to delete this product');

      await prisma.product.delete({ where: { id: productId } });

      return ResponseUtil.deleted('Product deleted successfully');
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Product not found');
        }
      }

      throw new InternalServerErrorException('Failed to delete product');
    }
  }

  async findAll(filters: GetProductsDto) {
    try {
      return await this.productBaseService.findProducts(filters);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException(
            'Product with similar details already exists',
          );
        }
      }
      throw new InternalServerErrorException('Failed to fetch products');
    }
  }

  //admin-get-specific-user-products by ID
  async adminGetUserProducts(userId: string, filters: GetProductsDto) {
    try {
      const additionalWhere = { userId };
      return await this.productBaseService.findProducts(
        filters,
        additionalWhere,
      );
    } catch (error) {
      console.error('Failed to fetch user products:', error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2021') {
          throw new InternalServerErrorException(
            'Database table does not exist',
          );
        }
      }

      throw new InternalServerErrorException('Failed to fetch user products');
    }
  }

  //get single product by ID
  async findOne(productId: string) {
    try {
      const product = await this.prisma.product.findFirst({
        where: {
          id: productId,
          status: ProductStatus.ACTIVE,
        },
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
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      return mapProductToResponseDto(product);
    } catch (error) {
      console.error('Failed to fetch product:', error);

      if (error instanceof NotFoundException) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2021') {
          throw new InternalServerErrorException(
            'Database table does not exist',
          );
        }
        if (error.code === 'P2023') {
          throw new BadRequestException('Invalid product ID format');
        }
      }

      throw new InternalServerErrorException('Failed to fetch product');
    }
  }

  //get a user products
  async getMyProducts(userId: string, filters: GetProductsDto) {
    try {
      const additionalWhere = { userId };
      return this.productBaseService.findProducts(filters, additionalWhere);
    } catch (error) {
      console.error('Failed to fetch user products:', error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2021') {
          throw new InternalServerErrorException(
            'Database table does not exist',
          );
        }
      }

      throw new InternalServerErrorException('Failed to fetch your products');
    }
  }

  //update product
  async updateProduct(
    productId: string,
    userId: string,
    updateProductDto: UpdateProductDto,
  ) {
    try {
      await this.productBaseService.validateProductOwnership(productId, userId);

      const updatedProduct = await this.prisma.product.update({
        where: { id: productId },
        data: updateProductDto,
        include: { category: true },
      });
      return mapProductToResponseDto(updatedProduct);
    } catch (error) {
      console.error('Product update failed:', error);

      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2002':
            throw new ConflictException(
              'Product with similar details already exists',
            );
          case 'P2003':
            throw new BadRequestException('Invalid category reference');
          case 'P2025':
            throw new NotFoundException('Product not found');
        }
      }

      throw new InternalServerErrorException('Failed to update product');
    }
  }

  //update product status
  async updateProductStatus(
    productId: string,
    userId: string,
    productStatus: ProductStatus.ACTIVE | ProductStatus.INACTIVE,
  ) {
    try {
      await this.productBaseService.validateProductOwnership(productId, userId);

      const updatedProduct = await this.prisma.product.update({
        where: { id: productId },
        data: { status: productStatus },
        include: { category: true },
      });

      return mapProductToResponseDto(updatedProduct);
    } catch (error) {
      console.error('Product status update failed:', error);

      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to update product status');
    }
  }
}
