import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

// ========== DTOs for Swagger Documentation ==========
export class PaginationInfoDto {
  @ApiProperty()
  currentPage: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  totalItems: number;

  @ApiProperty()
  itemsPerPage: number;

  @ApiProperty()
  hasNextPage: boolean;

  @ApiProperty()
  hasPrevPage: boolean;
}

export class ApiResponseDto<T = any> {
  @ApiProperty()
  success: boolean;

  @ApiProperty({ required: false })
  error?: string;

  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string;

  @ApiProperty({ required: false })
  data?: T;
}

export class PaginatedResponseDto<T = any> extends ApiResponseDto<T[]> {
  @ApiProperty({ type: PaginationInfoDto, required: false })
  pagination?: PaginationInfoDto;
}

// ========== Utility Classes ==========
export class PaginationUtil {
  static buildPaginationInfo(
    total: number,
    page: number,
    limit: number,
  ): PaginationInfoDto {
    const totalPages = Math.ceil(total / limit);

    return {
      currentPage: page,
      totalPages,
      totalItems: total,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  }
}

export class ResponseUtil {
  static success<T>(
    data: T,
    message: string = 'Success',
    statusCode: number = HttpStatus.OK,
  ): ApiResponseDto<T> {
    return {
      success: true,
      statusCode,
      message,
      data,
    };
  }

  static paginated<T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
    message: string = 'Data retrieved successfully',
  ): PaginatedResponseDto<T> {
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message,
      data,
      pagination: PaginationUtil.buildPaginationInfo(total, page, limit),
    };
  }

  static error(
    message: string,
    statusCode: number = HttpStatus.BAD_REQUEST,
    error?: string,
  ): ApiResponseDto {
    return {
      success: false,
      statusCode,
      error,
      message,
    };
  }

  static created<T>(
    data: T,
    message: string = 'Resource created successfully',
  ): ApiResponseDto<T> {
    return this.success(data, message, HttpStatus.CREATED);
  }

  static updated<T>(
    data: T,
    message: string = 'Resource updated successfully',
  ): ApiResponseDto<T> {
    return this.success(data, message, HttpStatus.OK);
  }

  static deleted(
    message: string = 'Resource deleted successfully',
  ): ApiResponseDto {
    return this.success(null, message, HttpStatus.OK);
  }

  static notFound(message: string = 'Resource not found'): ApiResponseDto {
    return this.error(message, HttpStatus.NOT_FOUND);
  }

  static unauthorized(message: string = 'Unauthorized'): ApiResponseDto {
    return this.error(message, HttpStatus.UNAUTHORIZED);
  }

  static forbidden(message: string = 'Forbidden'): ApiResponseDto {
    return this.error(message, HttpStatus.FORBIDDEN);
  }
}
