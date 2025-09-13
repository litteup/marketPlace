import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SessionService } from 'src/utils/session/session.service';

@Injectable()
export class DeleteAccountService {
  constructor(
    private readonly userService: UsersService,
    private readonly sessionService: SessionService,
  ) {}

  async delete(userId: string, session: Record<string, any>) {
    this.sessionService.clear(session);
    await this.userService.delete(userId);

    return 'Deleted successfully';
  }
}
