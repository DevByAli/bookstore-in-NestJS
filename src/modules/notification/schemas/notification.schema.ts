import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import { User } from 'src/modules/user/schemas/user.schema';
import { NotificationType } from '../enums/notificationType.enum';
import { Order } from 'src/modules/order/schemas/order.schema';

@Schema({ timestamps: true })
export class Notification {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  userId: string;

  @Prop({ required: true, ref: Order.name })
  orderId: string;

  @Prop({ default: false })
  isUserRead: boolean;

  @Prop({ default: NotificationType.NewOrder })
  type: NotificationType;

  @Prop({ default: false })
  isAdminRead: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
