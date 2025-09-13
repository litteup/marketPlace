import { MiddlewareConsumer, Module } from '@nestjs/common';

import { DeleteAccountModule } from './auth/delete-account/delete-account.module';
import { LoginModule } from './auth/login/login.module';
import { SignupModule } from './auth/signup/signup.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { SessionModule } from './utils/session/session.module';
import { MailModule } from './mailer/mailer.module';
import { PasswordResetModule } from './auth/password-reset/password-reset.module';
import { ConfigModule } from '@nestjs/config';
import { UploadModule } from './upload/upload.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UploadModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    HealthModule,
    LoginModule,
    SessionModule,
    UsersModule,
    SignupModule,
    DeleteAccountModule,
    PasswordResetModule,
    MailModule,
  ],
  providers: [PrismaService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
