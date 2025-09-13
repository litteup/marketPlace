import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import googleOauthConfig from './config/google-oauth.config';
import { GoogleStrategy } from './google-oauth/strategies/google.strategy';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GoogleOauthController } from './google-oauth/google-oauth.controller';
import { GoogleOauthService } from './google-oauth/google-oauth.service';
import { SessionModule } from 'src/utils/session/session.module';

@Module({
  imports: [
    PassportModule,
    PrismaModule,
    ConfigModule.forFeature(googleOauthConfig),
    SessionModule,
  ],
  controllers: [GoogleOauthController],
  providers: [GoogleStrategy, GoogleOauthService],
  exports: [GoogleOauthService],
})
export class AuthModule {}
