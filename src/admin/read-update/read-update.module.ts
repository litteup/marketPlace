import { Module } from '@nestjs/common';
import { ReadUpdateService } from './read-update.service';
import { ReadUpdateController } from './read-update.controller';
import { SessionModule } from 'src/utils/session/session.module';

@Module({
  imports: [SessionModule],
  providers: [ReadUpdateService],
  controllers: [ReadUpdateController],
})
export class ReadUpdateModule {}
