import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Order } from '../enums/order.enum';
import { SortBy } from '../enums/sortBy.enum';

export class SearchBooksDto {
  @IsString()
  @IsNotEmpty()
  query: string;

  @IsBoolean()
  @IsOptional()
  deepSearch?: boolean;

  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  pageNumber?: number;

  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  pageSize?: number;

  @IsOptional()
  @IsEnum(SortBy)
  sortBy?: SortBy;

  @IsOptional()
  @IsEnum(Order)
  order: Order = Order.Asc;
}
