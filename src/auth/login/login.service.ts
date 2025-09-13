import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
// import { PrismaService } from 'src/prisma/prisma.service';
import { SessionService } from 'src/utils/session/session.service';

import { LoginDto } from '../dto/login.dto';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

@Injectable()
export class LoginService {
  constructor(private readonly sessionService: SessionService) {}

  async login(user: LoginDto, session: Record<string, any>) {
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
      include: { password: true },
    });

    if (!existingUser || !existingUser.password) {
      return { message: 'Invalid credentials' };
    }

    // Check if user is verified
    if (existingUser.verification_status !== 'verified') {
      throw new UnauthorizedException(
        'Please verify your email before logging in. ',
      );
    }

    const isPasswordValid = await bcrypt.compare(
      user.password,
      existingUser.password.hash,
    );
    if (!isPasswordValid) {
      return { message: 'Invalid email or password' };
    }

    this.sessionService.setUser(session, {
      user: 'user',
      role: existingUser.role,
    });
    this.sessionService.setUserId(session, existingUser.id);
    return {
      message: 'Login successful!',
      data: {
        full_name: existingUser.full_name,
        email: existingUser.email,
        role: existingUser.role,
        phone_number: existingUser.phone,
        pic: existingUser.profile_picture,
        verification_status: existingUser.verification_status,
      },
    };
  }

  async logout(session: Record<string, any>) {
    return this.sessionService.clear(session);
  }
}
