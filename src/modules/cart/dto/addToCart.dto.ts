import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import mongoose from 'mongoose';

export class AddToCartDto {
  @IsNotEmpty()
  @IsMongoId()
  bookId: string;
}
