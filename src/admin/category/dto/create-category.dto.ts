import {
  Max,
  Min,
  IsNumber,
  IsString,
  MinLength,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @ApiProperty({
    example: 'Furniture',
  })
  name: string;

  @IsNumber({ allowNaN: false, allowInfinity: false })
  @IsNotEmpty()
  @Min(0)
  @Max(100)
  @ApiProperty({
    example: 15.5,
  })
  percentageFee: number;
}
