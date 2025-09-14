import { OfferStatus } from '@prisma/client';

export class ResponseOfferDto {
  id: string;
  productId: string;
  userId: string;
  status: OfferStatus;
  counterAmount: number;
  createdAt: Date;
  respondedAt?: Date | null;

  constructor(partial: Partial<ResponseOfferDto>) {
    Object.assign(this, partial);
  }
}
