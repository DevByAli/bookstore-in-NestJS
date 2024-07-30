import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class SocketRegistry {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  socketId: string;
}

export const SocketSchema = SchemaFactory.createForClass(SocketRegistry)