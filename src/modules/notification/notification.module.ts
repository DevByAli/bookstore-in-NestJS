import { MongooseModule } from '@nestjs/mongoose';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import {
  Notification,
  NotificationSchema,
} from './schemas/notification.schema';
import { RoleMiddleware } from 'src/middlewares/role.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService]
})
export class NotificationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(() => new RoleMiddleware(['user']))
      .forRoutes('notification/user')
      .apply(() => new RoleMiddleware(['admin']))
      .forRoutes('notification/admin');
  }
}
