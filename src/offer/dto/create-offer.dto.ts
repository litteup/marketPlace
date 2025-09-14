import { IsUUID, IsNumber, IsPositive } from 'class-validator';

export class CreateOfferDto {
  @IsUUID()
  productId: string;

  @IsNumber()
  @IsPositive()
  counterAmount: number;
}
