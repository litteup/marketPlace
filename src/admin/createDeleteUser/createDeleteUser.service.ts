import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ResponseUtil } from 'src/common/utils/response.util';

@Injectable()
export class CreateDeleteUserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: {
    email: string;
    password: string;
    full_name?: string;
    role?: string;
  }) {
    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);

      return await this.prisma.user.create({
        data: {
          email: data.email,
          full_name: data.full_name,
          role: data.role ?? 'user',
          password: {
            create: {
              hash: hashedPassword,
            },
          },
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          // Email already exists
          throw new ConflictException('Email already exists');
        }
      }
      console.error('❌ Error creating user:', err);
      throw new InternalServerErrorException(
        'Something went wrong while creating user',
      );
    }
  }

  async deleteUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const _deletedUser = await this.prisma.user.delete({
      where: { id: userId },
    });

    return ResponseUtil.deleted(`User with id ${userId} deleted successfully`);
  }
}
