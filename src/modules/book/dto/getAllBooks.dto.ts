import { Type } from 'class-transformer';
import { IsOptional, IsPositive, IsString, IsEnum } from 'class-validator';

import { SortingOrder } from '../enums/order.enum';
import { SortBy } from 'src/shared/enums/sortBy.enum';

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
  @IsEnum(SortingOrder)
  sortOrder?: SortingOrder = SortingOrder.Asc;
}
