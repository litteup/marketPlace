import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionService {
  getUser(session: Record<string, any>) {
    return session.user || null;
  }
  getUserId(session: Record<string, any>) {
    return session.userId || null;
  }

  setUser(session: Record<string, any>, user: any) {
    session.user = user;
  }

  setUserId(session: Record<string, any>, userId: string) {
    session.userId = userId;
  }

  clear(session: Record<string, any>) {
    session.destroy((err: string) => {
      if (err) console.error('Error destroying session:', err);
    });
  }
}
