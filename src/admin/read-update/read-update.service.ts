import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserQueryDto } from './dto/user-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUtil } from 'src/common/utils/filter.utils';
import { Prisma } from '@prisma/client';
import { ResponseUtil } from 'src/common/utils/response.util';

@Injectable()
export class ReadUpdateService {
  constructor(private readonly prisma: PrismaService) {}

  // Get all users with search & pagination (admin)
  async getAllUsers(userQueryDto: UserQueryDto) {
    try {
      const { skip, take, page, limit } = FilterUtil.getPaginationParams(
        userQueryDto.page,
        userQueryDto.limit,
      );

      const where = FilterUtil.buildGenericWhereClause(userQueryDto, {
        searchFields: ['full_name', 'email'],
        equalsFilters: [{ field: 'role', value: userQueryDto.role }],
      });

      const orderBy = FilterUtil.buildOrderBy(
        userQueryDto.sortBy,
        userQueryDto.sortOrder,
        'createdAt',
      );

      const [users, total] = await Promise.all([
        this.prisma.user.findMany({
          skip,
          take,
          where,
          orderBy,
        }),
        this.prisma.user.count({ where }),
      ]);

      return ResponseUtil.paginated(
        users,
        total,
        page,
        limit,
        'Users retrieved successfully',
      );
    } catch (error) {
      console.error('Failed to fetch users:', error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2021') {
          throw new InternalServerErrorException(
            'Database table does not exist',
          );
        }
      }

      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  // Get a single user by ID (admin)
  async getUserById(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      return ResponseUtil.success(user, 'User retrieved successfully');
    } catch (error) {
      console.error('Failed to fetch user:', error);

      if (error instanceof NotFoundException) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2023') {
          throw new BadRequestException('Invalid user ID format');
        }
      }

      throw new InternalServerErrorException('Failed to fetch user');
    }
  }

  async updateUser(id: string, data: UpdateUserDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: { id: true },
      });
      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      const updatedUser = await this.prisma.user.update({
        where: { id },
        data,
      });

      return ResponseUtil.updated(updatedUser, 'User updated successfully');
    } catch (error) {
      console.error('Failed to update user:', error);

      if (error instanceof NotFoundException) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2002':
            throw new BadRequestException(
              'User with this email already exists',
            );
          case 'P2025':
            throw new NotFoundException('User not found');
        }
      }

      throw new InternalServerErrorException('Failed to update user');
    }
  }
}
