import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpStatus,
  Param,
  Put,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SessionAuthGuard } from 'src/auth/guards/session-auth.guard';
import { ReadUpdateService } from './read-update.service';
import { UserQueryDto } from './dto/user-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RolesGuard } from 'src/auth/guards/role.guards';
import { ApiResponseDto } from 'src/common/utils/response.util';
import {
  UserPaginatedResponseDto,
  UserResponseDto,
} from './dto/user-response.dto';

@ApiTags('Admin')
@Controller('admin/user')
export class ReadUpdateController {
  constructor(private readonly readUpdateService: ReadUpdateService) {}

  /**
   * Get all users
   * @param session and query
   * @returns All users
   */
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Users retrieved successfully',
    type: UserPaginatedResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: ApiResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'Forbidden - Admin access required',
    type: ApiResponseDto,
  })
  @UseGuards(SessionAuthGuard, RolesGuard)
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'role', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @Roles('admin')
  @ApiCookieAuth()
  @Get()
  getAllUsers(
    @Session() session: Record<string, any>,
    @Query() query: UserQueryDto,
  ) {
    const adminId = session.userId;
    if (!adminId) {
      throw new ForbiddenException(
        'You do not have permission to get all users',
      );
    }

    return this.readUpdateService.getAllUsers(query);
  }

  /**
   * Get a user
   * @param id and session
   * @returns a user
   */
  @ApiOperation({ summary: 'Get a user by Id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User retrieved successfully',
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: ApiResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'Forbidden - Admin access required',
    type: ApiResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: ApiResponseDto,
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiCookieAuth()
  @Get(':id')
  getUser(@Param('id') id: string, @Session() session: Record<string, any>) {
    const adminId = session.userId;
    if (!adminId) {
      throw new ForbiddenException(
        'You do not have permission to get all users',
      );
    }

    return this.readUpdateService.getUserById(id);
  }

  /*
   * Update a user
   * @param id, session, and data
   * @returns an updated user
   */
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User updated successfully',
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: ApiResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'Forbidden - Admin access required',
    type: ApiResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: ApiResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad request - Invalid data',
    type: ApiResponseDto,
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ type: UpdateUserDto })
  @UseGuards(SessionAuthGuard, RolesGuard)
  @ApiCookieAuth()
  @Roles('admin')
  @Put(':id')
  updateUser(
    @Param('id') id: string,
    @Body() data: UpdateUserDto,
    @Session() session: Record<string, any>,
  ) {
    const adminId = session.userId;
    if (!adminId) {
      throw new ForbiddenException(
        'You do not have permission to update a user',
      );
    }

    return this.readUpdateService.updateUser(id, data);
  }
}
