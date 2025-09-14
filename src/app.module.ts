import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CategoryModule } from './admin/category/category.module';
import { ReadUpdateModule } from './admin/read-update/read-update.module';
import { AuthModule } from './auth/auth.module';
import { DeleteAccountModule } from './auth/delete-account/delete-account.module';
import { LoginModule } from './auth/login/login.module';
import { PasswordResetModule } from './auth/password-reset/password-reset.module';
import { SignupModule } from './auth/signup/signup.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { HealthModule } from './health/health.module';
import { MailModule } from './mailer/mailer.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { ProductModule } from './product/product.module';
import { UploadModule } from './upload/upload.module';
import { UsersModule } from './users/users.module';
import { SessionModule } from './utils/session/session.module';
import { OfferModule } from './offer/offer.module';
import { CreateDeleteUserModule } from './admin/createDeleteUser/createDeleteUser.module';

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    CategoryModule,
    ProductModule,
    ReadUpdateModule,
    UploadModule,
    PrismaModule,
    HealthModule,
    LoginModule,
    SessionModule,
    UsersModule,
    SignupModule,
    DeleteAccountModule,
    PasswordResetModule,
    MailModule,
    CreateDeleteUserModule,
    ProductModule,
    CategoryModule,
    ProductModule,
    AuthModule,
    ConfigModule,
    ReadUpdateModule,
    OfferModule,
  ],
  providers: [PrismaService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
