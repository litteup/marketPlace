import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/role.guards';
import { SessionAuthGuard } from 'src/auth/guards/session-auth.guard';

import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CreateDeleteUserService } from './createDeleteUser.service';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('Admin')
@UseGuards(SessionAuthGuard, RolesGuard)
@ApiCookieAuth()
@Controller('admin/users')
export class CreateDeleteUserController {
  constructor(private readonly adminService: CreateDeleteUserService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    schema: {
      example: {
        id: 'uuid-1234',
        email: 'jane@example.com',
        full_name: 'Jane Doe',
        role: 'user',
        createdAt: '2025-09-11T10:00:00.000Z',
        updatedAt: '2025-09-11T10:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  createUser(@Body() dto: CreateUserDto) {
    return this.adminService.createUser(dto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({
    name: 'id',
    example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
    description: 'User UUID',
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
    schema: {
      example: {
        message:
          'User with id a1b2c3d4-e5f6-7890-1234-56789abcdef0 deleted successfully',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }
}
