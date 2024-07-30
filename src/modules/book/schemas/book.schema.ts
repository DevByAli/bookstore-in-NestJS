import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Book {
  @Prop({ required: true, unique: true, trim: true })
  title: String;

  @Prop({ required: true, trim: true })
  author: String;

  @Prop({ required: true, min: 1 })
  price: Number;

  @Prop({ required: true, trim: true })
  description: String;

  @Prop({ required: true, type: [String] })
  tags: [String];

  @Prop({ default: 0 })
  purchased: Number;

  @Prop({ required: true, trim: true })
  url: String;

  @Prop({ required: true, trim: true })
  cloudinaryId: String;
}

const schema = SchemaFactory.createForClass(Book);
schema.index({ title: 'text', author: 'text' });

export const BookSchema = schema;
