import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductBaseService } from './product-base.service';
import { SessionService } from 'src/utils/session/session.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService, ProductBaseService, SessionService],
})
export class ProductModule {}
