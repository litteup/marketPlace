import { SessionService } from 'src/utils/session/session.service';

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(private sessionService: SessionService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // Get user from session using SessionService
    const user = this.sessionService.getUser(request.session);

    if (!user) {
      throw new ForbiddenException(
        'Access denied: No user found in session. Your session might be missing or expired. ➡ Please log in again.',
      );
    }

    // Attach user to request for downstream use
    request.user = user;

    return true;
  }
}
