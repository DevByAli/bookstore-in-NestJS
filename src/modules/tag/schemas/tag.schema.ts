import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Tag {
  @Prop({ required: true })
  tag: String;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
