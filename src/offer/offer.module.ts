import { Module } from '@nestjs/common';
import { OfferService } from './offer.service';
import { OfferController } from './offer.controller';
import { SessionService } from 'src/utils/session/session.service';

@Module({
  controllers: [OfferController],
  providers: [OfferService, SessionService],
})
export class OfferModule {}
