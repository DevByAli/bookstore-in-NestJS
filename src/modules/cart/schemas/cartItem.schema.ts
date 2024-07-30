import { Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import { Book } from 'src/modules/book/schemas/book.schema';

@Schema()
export class CartItemSchema {
  @Prop({
    ref: Book.name,
    required: true,
  })
  bookId: string;

  @Prop({ default: 1 })
  quantity: number;
}
