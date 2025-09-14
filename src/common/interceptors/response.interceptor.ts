import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((data) => {
        // If data is already formatted with our response util, return as is
        if (data && typeof data === 'object' && 'success' in data) {
          return data;
        }

        // Auto-format successful responses
        if (statusCode >= 200 && statusCode < 300) {
          return {
            success: true,
            statusCode,
            message: this.getMessageFromStatusCode(statusCode),
            data: data,
          };
        }

        return data;
      }),
    );
  }

  private getMessageFromStatusCode(statusCode: number): string {
    const messages = {
      [HttpStatus.OK]: 'Request successful',
      [HttpStatus.CREATED]: 'Resource created successfully',
      [HttpStatus.ACCEPTED]: 'Request accepted',
      [HttpStatus.NO_CONTENT]: 'Request successful',
    };

    return messages[statusCode] || 'Success';
  }
}
