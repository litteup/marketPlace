import {
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  Post,
  Session,
} from '@nestjs/common';
import { PasswordResetService } from './password-reset.service';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ValidateResetTokenDto } from './dto/validate-reset-token.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResponseUtil } from 'src/common/utils/response.util';

@ApiTags('Auth')
@Controller('password-reset')
export class PasswordResetController {
  constructor(private readonly passwordResetService: PasswordResetService) {}

  @Post('change-password')
  @HttpCode(200)
  @ApiOperation({ summary: 'Change password while logged in' })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully',
  })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiCookieAuth()
  @ApiBody({
    type: ChangePasswordDto,
  })
  async changePassword(
    @Session() session: Record<string, any>,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const userId: string = session.userId;
    if (!userId) {
      throw new ForbiddenException(
        'You do not have permission to change password',
      );
    }

    await this.passwordResetService.changePassword(userId, changePasswordDto);

    return ResponseUtil.success('Password Change Successfull');
  }

  //forgot-password
  @Post('forgot')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Request password reset email',
  })
  @ApiResponse({
    status: 200,
    description:
      'If the email exists, a password reset link will be sent to your email',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid email format',
  })
  @ApiBody({
    type: ForgotPasswordDto,
  })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    const message = await this.passwordResetService.requestPasswordReset(
      forgotPasswordDto.email,
    );
    return ResponseUtil.success(message);
  }

  //validate token
  @Post('validate-token')
  @HttpCode(200)
  @ApiOperation({ summary: 'Validate password reset token' })
  @ApiResponse({ status: 200, description: 'Token is valid' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  @ApiBody({ type: ValidateResetTokenDto })
  async validateResetToken(
    @Body() validateResetTokenDto: ValidateResetTokenDto,
  ) {
    const userId = await this.passwordResetService.validateResetToken(
      validateResetTokenDto.token,
    );
    return {
      message: 'Token is valid',
      valid: true,
      userId,
    };
  }

  //reset-password
  @Post('reset')
  @HttpCode(200)
  @ApiOperation({ summary: 'Reset password using token from email' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  @ApiBody({ type: ResetPasswordDto })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.passwordResetService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.new_password,
    );

    return ResponseUtil.success('Password reset successfully');
  }
}
