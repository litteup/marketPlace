import { Body, Controller, Post, Session } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginDto } from '../dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('login')
  @ApiOperation({ summary: 'login user' })
  @ApiResponse({ status: 201, description: 'user login successfully' })
  async login(
    @Body() loginDto: LoginDto,
    @Session() session: Record<string, any>,
  ) {
    return await this.loginService.login(loginDto, session);
  }

  @Post('logout')
  @ApiOperation({ summary: 'logout user' })
  @ApiResponse({ status: 201, description: 'user logout successfully' })
  async logout(@Session() session: Record<string, any>) {
    return await this.loginService.logout(session);
  }
}
