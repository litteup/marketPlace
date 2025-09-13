import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { SessionService } from 'src/utils/session/session.service';

@Injectable()
export class SessionAuthGaurd implements CanActivate {
  constructor(private readonly sessionService: SessionService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    const user = this.sessionService.getUser(request.session);

    return user?.id !== null;
  }
}
