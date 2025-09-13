import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { SessionService } from 'src/utils/session/session.service';

interface GoogleUserData {
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
}

@Injectable()
export class GoogleOauthService {
  constructor(
    private prisma: PrismaService,
    private sessionService: SessionService,
  ) {}

  async validateGoogleUser(userData: GoogleUserData): Promise<User> {
    // Combine first and last name for the full_name field
    const fullName = `${userData.firstName} ${userData.lastName}`.trim();

    // Check if user exists by Google ID
    let user = await this.prisma.user.findUnique({
      where: { googleId: userData.googleId },
    });

    if (user) {
      // Update user info if exists
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          full_name: fullName,
          profile_picture: userData.avatar,
        },
      });
      return user;
    }

    // Check if user exists by email (for account linking)
    user = await this.prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (user) {
      // Link existing account with Google
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          googleId: userData.googleId,
          provider: 'google',
          full_name: fullName,
          profile_picture: userData.avatar,
          verification_status: 'verified',
        },
      });
      return user;
    }

    // Create new user
    user = await this.prisma.user.create({
      data: {
        email: userData.email,
        googleId: userData.googleId,
        provider: 'google',
        full_name: fullName,
        profile_picture: userData.avatar,
        role: 'user',
        verification_status: 'verified',
      },
    });

    return user;
  }

  // Create session for Google OAuth user
  async createUserSession(user: User, session: Record<string, any>) {
    // Set user session data (same as login service)
    this.sessionService.setUser(session, {
      user: 'user',
      role: user.role,
    });

    this.sessionService.setUserId(session, user.id);

    return {
      message: 'Google login successful!',
      data: {
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        phone_number: user.phone,
        pic: user.profile_picture,
        verification_status: user.verification_status,
      },
    };
  }

  // Logout method (clear session)
  async logout(session: Record<string, any>) {
    return this.sessionService.clear(session);
  }
}
