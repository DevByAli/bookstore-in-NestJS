import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SocketRegistry, SocketSchema } from './schemas/socketRegistry.schema';
import { SocketGateway } from './socket.gateway';
import { NotificationModule } from 'src/modules/notification/notification.module';

@Module({
  imports: [
    NotificationModule,
    MongooseModule.forFeature([{ name: SocketRegistry.name, schema: SocketSchema }]),
  ],
  controllers: [],
  providers: [SocketGateway],
})
export class SocketModule {}
