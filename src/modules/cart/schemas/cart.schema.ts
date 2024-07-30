import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import { CartItemSchema } from './cartItem.schema';
import { User } from 'src/modules/user/schemas/user.schema';

@Schema({ timestamps: true })
export class Cart {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: mongoose.Schema.Types.ObjectId;

  @Prop({ type: [{ type: CartItemSchema }] })
  items: CartItemSchema[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);