import {
  // BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  // Session,
} from '@nestjs/common';
import { PasswordResetService } from './password-reset.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ValidateResetTokenDto } from './dto/validate-reset-token.dto';

@ApiTags('Auth')
@Controller('password-reset')
export class PasswordResetController {
  constructor(private readonly passwordResetService: PasswordResetService) {}

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
    return {
      message,
      success: true,
    };
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
      message: 'Toke is valid',
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
    return {
      message: 'Password reset successfully',
      success: true,
    };
  }

  // @Post('change-password')
  // @HttpCode(200)
  // @ApiOperation({ summary: 'Change password while logged in' })
  // @ApiResponse({ status: 200, description: 'Password changed successfully' })
  // @ApiResponse({ status: 401, description: 'Not authenticated' })
  // async changePassword(
  //   @Session() session: any,
  //   @Body() body: { currentPassword: string; newPassword: string },
  // ) {
  //   if (!session.userId) {
  //     throw new BadRequestException('Not authenticated');
  //   }

  //   // Implement password change logic here
  //   // Verify current password, then update to new password
  //   // Invalidate other sessions if needed

  //   return {
  //     message: 'Password changed successfully',
  //     success: true,
  //   };
  // }
}
