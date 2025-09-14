import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { SessionService } from 'src/utils/session/session.service';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, SessionService],
})
export class CategoryModule {}
