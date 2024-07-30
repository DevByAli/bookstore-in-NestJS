import { OrderModule } from './modules/order/order.module';
import { StatsModule } from './modules/stats/stats.module';
import { NotificationModule } from './modules/notification/notification.module';
import { CartModule } from './modules/cart/cart.module';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthMiddleware } from './middlewares/auth.middleware';
import { BookModule } from './modules/book/book.module';
import { TagModule } from './modules/tag/tag.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    OrderModule,
    StatsModule,
    CartModule,
    TagModule,
    UserModule,
    BookModule,
    NotificationModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DB_URL),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
