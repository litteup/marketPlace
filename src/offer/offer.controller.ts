import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Session,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { OfferService } from './offer.service';
import { SessionAuthGuard } from 'src/auth/guards/session-auth.guard';
import { CreateOfferDto } from './dto/create-offer.dto';

@Controller('offer')
export class OfferController {
  constructor(private readonly offerService: OfferService) {}

  @Post()
  @UseGuards(SessionAuthGuard)
  async createOffer(
    @Body() createOfferDto: CreateOfferDto,
    @Session() session: Record<string, any>,
  ) {
    const userId: string = session.userId;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    return await this.offerService.createOffer(createOfferDto, userId);
  }

  @Patch('/:offerId/withdraw')
  @UseGuards(SessionAuthGuard)
  async withdrawOffer(
    @Param('offerId') offerId: string,
    @Session() session: Record<string, any>,
  ) {
    const userId: string = session.userId;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    return await this.offerService.withdrawOffer(offerId, userId);
  }

  @Patch('/:offerId/accept')
  @UseGuards(SessionAuthGuard)
  async acceptOffer(
    @Param('offerId') offerId: string,
    @Session() session: Record<string, any>,
  ) {
    const userId: string = session.userId;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    return await this.offerService.acceptOffer(offerId, userId);
  }

  @Patch('/:offerId/reject')
  @UseGuards(SessionAuthGuard)
  async rejectOffer(
    @Param('offerId') offerId: string,
    @Session() session: Record<string, any>,
  ) {
    const userId: string = session.userId;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    return await this.offerService.rejectOffer(offerId, userId);
  }

  @Get('/:offerId')
  @UseGuards(SessionAuthGuard)
  async findOneOffer(
    @Param('offerId') offerId: string,
    @Session() session: Record<string, any>,
  ) {
    const userId: string = session.userId;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    return await this.offerService.findOneOffer(offerId, userId);
  }
}
