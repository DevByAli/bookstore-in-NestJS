import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationService } from 'src/modules/notification/notification.service';
import { SocketNewOrderDto } from './dto/newOrder.dto.socket.dto';
import { SocketRegisterUserDto } from './dto/registerUser.socket.dto';
import { ROLE_ADMIN } from 'src/utils/constants';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SocketRegistry } from './schemas/socketRegistry.schema';

@WebSocketGateway({ transports: ['websocket'] })
export class SocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: Server;
  adminSocket: string | null = null;

  constructor(
    @InjectModel(SocketRegistry.name)
    private readonly socketModel: Model<SocketRegistry>,
    private readonly notificationService: NotificationService,
  ) {}

  @SubscribeMessage('registerUser')
  async handleRegister(
    @ConnectedSocket() connectedSocket: Socket,
    @MessageBody() socketregisterUserDto: SocketRegisterUserDto,
  ) {
    const { userId, role } = socketregisterUserDto;

    if (role === ROLE_ADMIN) {
      this.adminSocket = connectedSocket.id;
    } else {
      await this.socketModel.create({ userId, socketId: connectedSocket.id });
    }
  }

  @SubscribeMessage('newOrder')
  async handleEvent(
    @ConnectedSocket() connectedSocket: Socket,
    @MessageBody() newOrderDto: SocketNewOrderDto,
  ) {
    const { userId, orderId } = newOrderDto;
    const notification = await this.notificationService.createNotification(
      userId,
      orderId,
    );

    this.server.to(connectedSocket.id).emit('newNotification', notification);

    if (this.adminSocket) {
      this.server.to(this.adminSocket).emit('newNotification', notification);
    }
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log('User connected');
  }

  handleDisconnect(client: any) {
    console.log('User disconnected');
  }

  afterInit(server: any) {
    console.log('Socket server is live');
  }
}
