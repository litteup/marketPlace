import { SessionService } from 'src/utils/session/session.service';

import {
  Controller,
  Delete,
  Session,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { SessionAuthGuard } from '../guards/session-auth.guard';
import { DeleteAccountService } from './delete-account.service';

@ApiTags('Auth')
@Controller('auth')
export class DeleteAccountController {
  constructor(
    private readonly deleteAccountService: DeleteAccountService,
    private sessionService: SessionService,
  ) {}
  @ApiOperation({ summary: 'Delete an account' })
  @ApiResponse({
    status: 200,
    description: 'Account successfuly deleted',
  })
  @ApiBadRequestResponse({ description: 'Something went worng' })
  @UseGuards(SessionAuthGuard)
  @ApiCookieAuth()
  @Delete('delete-account')
  async delete(@Session() session: Record<string, any>): Promise<string> {
    const userId: string = session.userId;
    if (!userId) {
      throw new UnauthorizedException();
    }
    return await this.deleteAccountService.delete(userId, session);
  }
}
