import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { ResponseOfferDto } from './dto/response-offer.dto';

@Injectable()
export class OfferService {
  constructor(private readonly prisma: PrismaService) {}

  //Create offer
  async createOffer(createOfferDto: CreateOfferDto, userId: string) {
    const { productId } = createOfferDto;
    const existingOffer = await this.prisma.offer.findFirst({
      where: { userId, productId, status: 'PENDING' },
    });
    if (existingOffer) {
      throw new ConflictException(
        'You already have a pending offer for this product',
      );
    }
    const offer = await this.prisma.offer.create({
      data: {
        ...createOfferDto,
        userId,
      },
    });

    return new ResponseOfferDto({
      ...offer,
      counterAmount: offer.counterAmount.toNumber(),
    });
  }

  //Withdraw offer
  async withdrawOffer(offerId: string, userId: string) {
    const existingOffer = await this.prisma.offer.findFirst({
      where: { id: offerId },
    });
    if (!existingOffer || existingOffer.userId !== userId) {
      throw new NotFoundException('Offer not found');
    }
    //Only pending offer
    if (existingOffer.status !== 'PENDING') {
      throw new BadRequestException(
        'You can only withdraw an offer that is pending',
      );
    }
    const withdrawnOffer = await this.prisma.offer.update({
      where: { id: offerId },
      data: { status: 'WITHDRAWN', respondedAt: new Date() },
    });

    return new ResponseOfferDto({
      ...withdrawnOffer,
      counterAmount: withdrawnOffer.counterAmount.toNumber(),
    });
  }

  //Accept offer(seller)
  async acceptOffer(offerId: string, userId: string) {
    const existingOffer = await this.prisma.offer.findFirst({
      where: { id: offerId },
      include: {
        product: {
          include: { user: true },
        },
      },
    });
    if (!existingOffer) {
      throw new BadRequestException('Offer not found');
    }
    if (existingOffer.product.userId !== userId) {
      throw new BadRequestException('Seller not found');
    }
    if (existingOffer.status !== 'PENDING') {
      throw new BadRequestException(
        'Only pending offers can be accepted or rejected',
      );
    }

    const acceptOffer = await this.prisma.offer.update({
      where: { id: offerId },
      data: { status: 'APPROVED', respondedAt: new Date() },
    });

    //Rejects other offers expect accepted offer
    await this.prisma.offer.updateMany({
      where: {
        productId: existingOffer.productId,
        status: 'PENDING',
        NOT: { id: offerId },
      },
      data: {
        status: 'REJECTED',
        respondedAt: new Date(),
      },
    });

    return new ResponseOfferDto({
      ...acceptOffer,
      counterAmount: acceptOffer.counterAmount.toNumber(),
    });
  }

  //Reject offer(seller)
  async rejectOffer(offerId: string, userId: string) {
    const existingOffer = await this.prisma.offer.findFirst({
      where: { id: offerId },
      include: {
        product: {
          include: { user: true },
        },
      },
    });
    if (!existingOffer) {
      throw new BadRequestException('Offer not found');
    }
    if (existingOffer.product.userId !== userId) {
      throw new BadRequestException('Seller not found');
    }
    if (existingOffer.status !== 'PENDING') {
      throw new BadRequestException(
        'Only pending offers can be accepted or rejected',
      );
    }

    const rejectOffer = await this.prisma.offer.update({
      where: { id: offerId },
      data: { status: 'REJECTED', respondedAt: new Date() },
    });

    return new ResponseOfferDto({
      ...rejectOffer,
      counterAmount: rejectOffer.counterAmount.toNumber(),
    });
  }

  //Get single offer
  async findOneOffer(offerId: string, userId: string) {
    const existingOffer = await this.prisma.offer.findFirst({
      where: { id: offerId },
      include: {
        product: {
          include: { user: true },
        },
        user: true,
      },
    });
    if (!existingOffer) {
      throw new NotFoundException('Offer not found');
    }

    //Checks if you are the buyer or the seller
    if (
      existingOffer.userId !== userId &&
      existingOffer.product.userId !== userId
    ) {
      throw new BadRequestException('You cannot view this offer');
    }
    return new ResponseOfferDto({
      ...existingOffer,
      counterAmount: existingOffer.counterAmount.toNumber(),
    });
  }
}
