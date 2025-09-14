import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';

@Injectable()
export class CustomUUIDPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (!uuidValidate(value)) {
      throw new BadRequestException('Invalid ID format');
    }
    return value;
  }
}
