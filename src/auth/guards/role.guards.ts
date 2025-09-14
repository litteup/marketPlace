import { Request } from 'express';
import { SessionService } from 'src/utils/session/session.service';

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private sessionService: SessionService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const user = this.sessionService.getUser(request.session);

    if (!user) {
      throw new ForbiddenException(
        'Access denied: No user found in session. Please log in again.',
      );
    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        `Access denied: Your role "${user.role}" does not have permission. ` +
          `Required roles: [${requiredRoles.join(', ')}].`,
      );
    }

    return true;
  }
}
