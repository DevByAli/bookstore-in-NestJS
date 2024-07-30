import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class PaymentResult {
  @Prop({ required: true })
  paymentId: string;

  @Prop({ required: true })
  refundId: string;
}

export const PaymentResultSchema = SchemaFactory.createForClass(PaymentResult);
