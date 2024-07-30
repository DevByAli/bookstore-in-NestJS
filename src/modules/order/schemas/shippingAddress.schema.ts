import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class ShippingAddress {
  @Prop({ required: true })
  line1: string;

  @Prop({ required: true })
  line2: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  postalCode: string;

  @Prop({ required: true })
  country: string;
}

export const ShippingAddressSchema = SchemaFactory.createForClass(ShippingAddress);