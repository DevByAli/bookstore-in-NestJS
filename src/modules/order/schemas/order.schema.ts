import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import { User } from 'src/modules/user/schemas/user.schema';
import { OrderStatus } from '../enums/orderStatus.enum';
import { ShippingAddress } from './shippingAddress.schema';
import { PaymentResult } from './paymentResult.schema';
import { OrderItem } from './orderItem.schema';
import { Book } from 'src/modules/book/schemas/book.schema';

@Schema({ timestamps: true })
export class Order {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: [OrderItem], required: true })
  items: OrderItem[];

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ default: OrderStatus.PENDING })
  status: OrderStatus;

  @Prop({ type: ShippingAddress, required: true })
  shippingAddress: ShippingAddress;

  @Prop({ default: 'stripe' })
  paymentMethod: string;

  @Prop({ type: PaymentResult, required: true })
  paymentResult: PaymentResult;
}

const schema = SchemaFactory.createForClass(Order);

schema.post('save', async function (document) {
  for (const item of document.items) {
    await mongoose.model(Book.name).findByIdAndUpdate(item.bookId, {
      $inc: { purchased: item.quantity },
    });
  }
});

export const OrderSchema = schema;
