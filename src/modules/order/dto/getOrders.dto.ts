import { IsEnum, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

import { SortingOrder } from 'src/modules/book/enums/order.enum';
import { OrderStatus } from '../enums/orderStatus.enum';

export class GetOrdersDto {
  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  page: number = 1;

  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  limit: number = 10;

  @IsNotEmpty()
  @IsEnum(SortingOrder)
  sortOrder: SortingOrder = SortingOrder.Asc;

  @IsNotEmpty()
  @IsEnum(OrderStatus)
  status: OrderStatus = OrderStatus.PENDING
}
