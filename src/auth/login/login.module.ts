import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { SessionModule } from 'src/utils/session/session.module';

@Module({
  imports: [SessionModule],
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule {}
