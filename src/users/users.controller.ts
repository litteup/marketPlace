import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  Put,
  Session,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SessionAuthGaurd } from 'src/auth/guards/session-auth.gaurd';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  /**
   * Get current user profile
   * @param userId - the ID of the user
   * @returns The current user profile
   */
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'Current user profile',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(SessionAuthGaurd)
  @Get('profile')
  // TODO add a current user ID
  async getProfile(@Session() session: Record<string, any>): Promise<User> {
    const userId: string = session.userId;
    if (!userId) {
      throw new UnauthorizedException('');
    }
    try {
      return await this.userService.findById(userId);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occured while trying to fetch user profile',
      );
    }
  }

  @ApiOperation({ summary: 'Update a profile' })
  @ApiResponse({
    status: 200,
    description: 'Profile updated by id',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(SessionAuthGaurd)
  @Put('profile')
  async updateProfile(
    @Session() session: Record<string, any>,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const userId: string = session.userId;
    if (!userId) {
      throw new ForbiddenException(
        'you do not have permission to update a note',
      );
    }

    return await this.userService.updateProfile(userId, updateProfileDto);
  }
}
