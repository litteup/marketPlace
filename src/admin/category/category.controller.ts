import {
  Post,
  Body,
  Patch,
  Param,
  HttpCode,
  UseGuards,
  HttpStatus,
  Controller,
  Get,
  Query,
  Delete,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { RolesGuard } from 'src/auth/guards/role.guards';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/role.decorator';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { SessionAuthGuard } from 'src/auth/guards/session-auth.guard';
import {
  CategoryResponseDto,
  DeleteCategoryResponseDto,
  ErrorResponseDto,
  PaginatedCategoryResponseDto,
} from './dto/category-response.dto';
import { GetCategoryDto } from './dto/get-category.dto';
import { CustomUUIDPipe } from 'src/common/pipes/custom-uuid.pipe';

@ApiTags('Admin')
@Controller('admin/category')
@ApiCookieAuth()
@UseGuards(SessionAuthGuard, RolesGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create Listing Category',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
    type: CategoryResponseDto,
  })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Patch(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update Listing Category',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
    type: CategoryResponseDto,
  })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update({ id }, updateCategoryDto);
  }

  // get all categories with pagination and search
  @Get()
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    description: 'OK',
    type: PaginatedCategoryResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    type: ErrorResponseDto,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
  })
  async findAll(@Query() filters: GetCategoryDto) {
    return this.categoryService.findAll(filters);
  }

  // get a single category by id
  @Get(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a single category by ID' })
  @ApiParam({
    name: 'id',
    description: 'Category ID',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
    type: CategoryResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    type: ErrorResponseDto,
  })
  async findOne(@Param('id', CustomUUIDPipe) id: string) {
    return this.categoryService.findOne(id);
  }

  // delete a category by id
  @Delete(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a category' })
  @ApiParam({
    name: 'id',
    description: 'Category ID',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
    type: DeleteCategoryResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    type: ErrorResponseDto,
  })
  // @ApiBearerAuth()
  async remove(
    @Param('id', CustomUUIDPipe) id: string,
  ): Promise<DeleteCategoryResponseDto> {
    return this.categoryService.remove(id);
  }
}
