import { IsNotEmpty, IsString } from 'class-validator';

export class SocketNewOrderDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  orderId: string;
}
