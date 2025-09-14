import * as bcrypt from 'bcrypt';
import { ResponseUtil } from 'src/common/utils/response.util';
import { SessionService } from 'src/utils/session/session.service';

import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

import { LoginUserDto } from '../dto/login.dto';
import { LoginResponse } from './dto/login-response.dto';

const prisma = new PrismaClient();

@Injectable()
export class LoginService {
  constructor(private readonly sessionService: SessionService) {}

  async login(user: LoginUserDto, session: Record<string, any>) {
    try {
      // Find the user by email, including password hash
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
        include: { password: true },
      });

      if (!existingUser || !existingUser.password) {
        throw new ForbiddenException('Invalid credentials');
      }

      // Check if user is verified
      if (existingUser.verification_status !== 'verified') {
        throw new UnauthorizedException(
          'Please verify your email before logging in.',
        );
      }

      // Validate password
      const isPasswordValid = await bcrypt.compare(
        user.password,
        existingUser.password.hash,
      );
      if (!isPasswordValid) {
        throw new ForbiddenException('Invalid email or password');
      }

      // ✅ Save user info in session
      this.sessionService.setUser(session, {
        id: existingUser.id,
        full_name: existingUser.full_name,
        email: existingUser.email,
        role: existingUser.role,
      });
      this.sessionService.setUserId(session, existingUser.id);

      // Prepare response data
      const userData: LoginResponse = {
        id: existingUser.id,
        full_name: existingUser.full_name,
        email: existingUser.email,
        role: existingUser.role,
        phone_number: existingUser.phone,
        pic: existingUser.profile_picture,
        verification_status: existingUser.verification_status,
      };

      // ✅ Persist session before returning response
      return new Promise((resolve) => {
        session.save(() => {
          resolve(ResponseUtil.success(userData, 'Login successful'));
        });
      });
    } catch (error) {
      if (
        error instanceof ForbiddenException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('User not found');
        }
      }

      throw new InternalServerErrorException('Login failed. Please try again.');
    }
  }

  async getSession(session: Record<string, any>) {
    return this.sessionService.getUser(session);
  }

  async logout(session: Record<string, any>) {
    return this.sessionService.clear(session);
  }
}
