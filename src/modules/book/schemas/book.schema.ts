import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Book {
  @Prop({ required: true, unique: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  author: string;

  @Prop({ required: true, min: 1 })
  price: Number;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ required: true, type: [String] })
  tags: string[];

  @Prop({ default: 0 })
  purchased: Number;

  @Prop({ required: true, trim: true })
  url: string;

  @Prop({ required: true, trim: true })
  cloudinaryId: string;
}

const schema = SchemaFactory.createForClass(Book);
schema.index({ title: 'text', author: 'text' });

export const BookSchema = schema;
