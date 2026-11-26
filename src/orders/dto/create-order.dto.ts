import { IsString, IsNumber, Min } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  customerId: string;

  @IsString()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}
