import { Type } from 'class-transformer';
import { IsOptional, IsPositive, IsString, IsEnum } from 'class-validator';

import { Order } from '../enums/order.enum';
import { SortBy } from '../enums/sortBy.enum';

export class GetAllBooksDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  pageNumber?: number;

  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  pageSize?: number;

  @IsString()
  @IsOptional()
  @IsEnum(SortBy)
  sortBy?: SortBy;

  @IsString()
  @IsOptional()
  @IsEnum(Order)
  order?: Order = Order.Asc;
}
