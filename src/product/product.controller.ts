import { Roles } from 'src/auth/decorators/role.decorator';
import { RolesGuard } from 'src/auth/guards/role.guards';
import { SessionAuthGuard } from 'src/auth/guards/session-auth.guard';
import { ApiResponseDto } from 'src/common/utils/response.util';

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CreateProductDto } from './dto/create-product.dto';
import {
  GetProductsDto,
  ProductStatus,
  SortOrder,
} from './dto/get-product.dto';
import {
  PaginatedProductResponseDto,
  ProductResponseDto,
} from './dto/product-response.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';
import { ProductStatusDto } from './dto/product-status.dto';

@ApiTags('Listing')
@Controller('listing')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  //get my products
  @Get('my-products')
  @ApiOperation({ summary: 'Get all products of the authenticated user' })
  @ApiCookieAuth()
  @UseGuards(SessionAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'User products retrieved successfully',
    type: PaginatedProductResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: ApiResponseDto,
  })
  async getMyProduct(
    @Session() session: Record<string, any>,
    @Query() filters: GetProductsDto,
  ) {
    const userId: string = session.userId;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    return await this.productService.getMyProducts(userId, filters);
  }

  //add product
  @Post('add')
  @ApiCookieAuth()
  @UseGuards(SessionAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'user adds product to listing' })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: ProductResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
    type: ApiResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: ApiResponseDto,
  })
  @ApiBody({
    type: CreateProductDto,
  })
  async create(
    @Body() dto: CreateProductDto,
    @Session() session: Record<string, any>,
  ) {
    const userId: string = session.userId;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    return this.productService.createProduct(dto, userId);
  }

  //delete my product
  @Delete(':id')
  @ApiCookieAuth()
  @UseGuards(SessionAuthGuard)
  @ApiOperation({ summary: 'user deletes product from listing' })
  @ApiResponse({
    status: 200,
    description: 'Product deleted successfully',
    type: ApiResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: ApiResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Product not found',
    type: ApiResponseDto,
  })
  async remove(
    @Session() session: Record<string, any>,
    @Param('id') id: string,
  ) {
    const userId: string = session.userId;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    return this.productService.deleteProduct(userId, id);
  }

  //get all products
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all products with filtering and pagination' })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
    type: PaginatedProductResponseDto,
  })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'country', required: false, type: String })
  @ApiQuery({ name: 'state', required: false, type: String })
  @ApiQuery({ name: 'city', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: ProductStatus })
  @ApiQuery({ name: 'sortByPrice', required: false, enum: SortOrder })
  @ApiQuery({ name: 'sortByDate', required: false, enum: SortOrder })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(@Query() filters: GetProductsDto) {
    return await this.productService.findAll(filters);
  }

  //get user product (admin)
  @Get('user/:userId')
  @ApiCookieAuth()
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Get all users products with filtering and pagination (Admin Route)',
  })
  @ApiResponse({
    status: 200,
    description: 'User products retrieved successfully',
    type: PaginatedProductResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: ApiResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
    type: ApiResponseDto,
  })
  async getUserProducts(
    @Param('userId') userId: string,
    @Query() filters: GetProductsDto,
  ) {
    return this.productService.adminGetUserProducts(userId, filters);
  }

  //get single product
  @Get(':productId')
  @ApiOperation({ summary: 'Get a single product by ID' })
  @ApiParam({ name: 'productId', required: true, description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Product retrieved successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
    type: ApiResponseDto,
  })
  async findOne(@Param('productId') productId: string) {
    const product = await this.productService.findOne(productId);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Product retrieved successfully',
      data: product,
    };
  }

  //update product
  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing product' })
  @ApiResponse({
    status: 200,
    description: 'Product successfully updated',
    type: ProductResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid request data or product not found',
    type: ApiResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: ApiResponseDto,
  })
  @ApiCookieAuth()
  @UseGuards(SessionAuthGuard)
  async updateProduct(
    @Param('id') productId: string,
    @Session() session: Record<string, any>,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const userId: string = session.userId;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    const product = await this.productService.updateProduct(
      productId,
      userId,
      updateProductDto,
    );

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Product updated successfully',
      data: product,
    };
  }

  //update product status (admin)
  @Patch(':productId/status')
  @ApiOperation({ summary: 'Update an existing product status' })
  @ApiResponse({
    status: 200,
    description: 'Product status updated successfully!',
    type: ProductResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid request data or product not found!',
    type: ApiResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized!',
    type: ApiResponseDto,
  })
  @ApiCookieAuth()
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles('admin')
  async updateProductStatus(
    @Param('productId') productId: string,
    @Session() session: Record<string, any>,
    @Body() productStatusDto: ProductStatusDto,
  ) {
    const userId: string = session.userId;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    const product = await this.productService.updateProductStatus(
      productId,
      userId,
      productStatusDto.status,
    );

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Product updated successfully',
      data: product,
    };
  }
}
