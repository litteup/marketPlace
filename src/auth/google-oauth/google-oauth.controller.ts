import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from '../guards/google-auth/google-auth.guard';
import { ConfigService } from '@nestjs/config';
import {
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../decorators/public.decorators';
import { Request, Response } from 'express';
import { GoogleOauthService } from './google-oauth.service';

@ApiTags('Auth')
@Controller('auth')
export class GoogleOauthController {
  constructor(
    private readonly authService: GoogleOauthService,
    private configService: ConfigService,
  ) {}

  // Google OAuth initiation - redirects to Google
  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  @ApiOperation({
    summary: 'Initiate Google OAuth login',
    description:
      'Redirects the user to Google OAuth consent screen. ' +
      'No request body is required. ' +
      'Swagger cannot follow redirects, so test this endpoint directly in a browser.',
  })
  @ApiResponse({
    status: 302,
    description: 'Redirects to Google OAuth consent screen',
  })
  googleLogin() {}

  // Google OAuth callback - handles Google's redirect back
  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  @ApiExcludeEndpoint()
  @ApiOperation({
    summary: 'Google OAuth callback handler',
    description:
      'Handles Google OAuth response. ' +
      'Creates/updates the user in the database, starts a session, ' +
      'and finally redirects to your frontend application. ' +
      'Note: Swagger cannot simulate this redirect flow, use browser testing.',
  })
  @ApiResponse({
    status: 302,
    description: 'Redirects to frontend application with authentication tokens',
  })
  @ApiResponse({
    status: 400,
    description: 'Google OAuth authentication failed',
  })
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    try {
      const googleUser = req.user as any;

      if (!googleUser) {
        console.error('No user data received from Google OAuth');
        const errorUrl = `${this.configService.get('LOGIN_FRONTEND_URL')}/auth/error?message=Authentication failed`;
        return res.redirect(errorUrl);
      }

      // console.log('Google user data received:', googleUser);

      // Map Google user data to your service's expected format
      const userData = {
        googleId: googleUser.id || googleUser.googleId,
        email: googleUser.email,
        firstName: googleUser.firstName || googleUser.name?.givenName || '',
        lastName: googleUser.lastName || googleUser.name?.familyName || '',
        avatar: googleUser.picture || googleUser.avatar || '',
      };

      // Validate and create/update user
      const user = await this.authService.validateGoogleUser(userData);

      // Create user session
      await this.authService.createUserSession(user, req.session);

      // console.log('User session created successfully');

      // Redirect to frontend
      const frontendUrl = this.configService.get('LOGIN_FRONTEND_URL');
      const successUrl = `${frontendUrl}`;

      return res.redirect(successUrl);
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorUrl = `${this.configService.get('LOGIN_FRONTEND_URL')}/auth/error?message=Authentication failed&error=${encodeURIComponent(errorMessage)}`;
      return res.redirect(errorUrl);
    }
  }
}
