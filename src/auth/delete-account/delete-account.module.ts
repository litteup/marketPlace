import { Module } from '@nestjs/common';
import { DeleteAccountService } from './delete-account.service';
import { DeleteAccountController } from './delete-account.controller';
import { UsersService } from 'src/users/users.service';
import { SessionModule } from 'src/utils/session/session.module';

@Module({
  imports: [SessionModule],
  controllers: [DeleteAccountController],
  providers: [DeleteAccountService, UsersService],
})
export class DeleteAccountModule {}
