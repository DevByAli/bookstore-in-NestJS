import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class PaymentResult {
  @Prop({ required: true })
  paymentIntent: string;

  @Prop({ required: true })
  refundId: string;
}

export const PaymentResultSchema = SchemaFactory.createForClass(PaymentResult);
