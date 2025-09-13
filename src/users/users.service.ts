import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = await this.prisma.user.create({ data });
    return user;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const existingUser = await this.prisma.user.findFirst({
      where: { email },
    });

    return existingUser;
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`user with id: ${id} not found`);
    }

    return user;
  }

  async updateProfile(
    // TODO current user
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException();
    }

    const updatedProfile = await this.prisma.user.update({
      where: { id: userId },
      data: updateProfileDto,
    });

    return updatedProfile;
  }

  async delete(id: string) {
    await this.prisma.user.delete({ where: { id } });
  }
}
