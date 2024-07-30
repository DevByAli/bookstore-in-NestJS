import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class OrderItem {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  book: mongoose.Schema.Types.ObjectId;

  @Prop({ min: 1, required: true })
  quantity: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);