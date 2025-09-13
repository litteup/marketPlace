import { Module } from '@nestjs/common';
import { SignupService } from './signup.service';
import { SignupController } from './signup.controller';
import { UsersService } from 'src/users/users.service';
import { OtpService } from 'src/mailer/otp.service';
import { MailService } from 'src/mailer/mailer.service';
import { MailModule } from 'src/mailer/mailer.module';

@Module({
  imports: [MailModule],
  controllers: [SignupController],
  providers: [SignupService, UsersService, OtpService, MailService],
})
export class SignupModule {}
