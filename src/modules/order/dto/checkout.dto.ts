import { Type } from 'class-transformer';
import {
    IsNotEmpty,
    IsNumber,
    IsPositive,
    IsString,
    IsUrl,
    ValidateNested,
} from 'class-validator';

export class Book {
  @IsNotEmpty()
  @IsString()
  public title: string;

  @IsNotEmpty()
  @IsNumber()
  public price: number;

  @IsNotEmpty()
  @IsUrl()
  url: string;
}

export class CheckoutDto {
  @IsNotEmpty()
  @Type(() => Book)
  @ValidateNested({ each: true })
  public book: Book;

  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  public quantity: number;
}
