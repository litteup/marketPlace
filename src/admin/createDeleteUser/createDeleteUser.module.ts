import { PrismaService } from 'src/prisma/prisma.service';
import { SessionModule } from 'src/utils/session/session.module';

import { Module } from '@nestjs/common';

import { CreateDeleteUserController } from './createDeleteUser.controller';
import { CreateDeleteUserService } from './createDeleteUser.service';

@Module({
  imports: [SessionModule],
  controllers: [CreateDeleteUserController],
  providers: [CreateDeleteUserService, PrismaService],
})
export class CreateDeleteUserModule {}
