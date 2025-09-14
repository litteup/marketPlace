import { getPasswordHash } from 'src/utils/auth';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignupDto } from './dto/signup.dto';
import { SignupService } from './signup.service';
import { ResendEmailDto, VerifyEmailDto } from './dto/verifyEmail.dto';
import { SignupResponseDto } from './dto/signup-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class SignupController {
  constructor(private readonly signupService: SignupService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register user',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User registered successfully',
    type: SignupResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid email format',
  })
  @ApiBody({
    type: SignupDto,
  })
  async signup(@Body() signupDto: SignupDto) {
    const passwordHash = await getPasswordHash(signupDto.password);
    return await this.signupService.signup({
      ...signupDto,
      password: { create: { hash: passwordHash } },
    });
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify email address',
  })
  @ApiResponse({
    status: 200,
    description: 'Email Verified.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid email format',
  })
  @ApiBody({
    type: VerifyEmailDto,
  })
  async verifyEmail(@Body() verifyData: VerifyEmailDto) {
    return this.signupService.verifyEmail(verifyData.email, verifyData.code);
  }

  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    type: ResendEmailDto,
  })
  async resendOtp(@Body() resendData: ResendEmailDto) {
    return this.signupService.resendOtp(resendData.email);
  }
}
