import { Body, Controller, Get, HttpCode, Post, Session } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { LoginUserDto } from '../dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginService } from './login.service';

@ApiTags('Auth')
@Controller('auth')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'User login successfully',
    type: LoginResponseDto,
  })
  async login(
    @Body() loginDto: LoginUserDto,
    @Session() session: Record<string, any>,
  ) {
    return await this.loginService.login(loginDto, session);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({
    status: 200,
    description: 'User logged out successfully',
  })
  async logout(@Session() session: Record<string, any>) {
    return await this.loginService.logout(session);
  }

  @Get('me')
  @HttpCode(200)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get current logged-in user profile' })
  @ApiResponse({
    status: 200,
    description: 'Returns the currently logged-in user profile',
    type: LoginResponseDto,
  })
  getProfile(@Session() session: Record<string, any>) {
    return this.loginService.getSession(session);
  }
}
