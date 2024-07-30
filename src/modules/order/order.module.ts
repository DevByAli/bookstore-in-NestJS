import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import Stripe from 'stripe';

import { PaymentService } from 'src/shared/services/payment.service';
import { BookModule } from '../book/book.module';
import { MailService } from 'src/shared/services/mail.service';
import { NotificationModule } from '../notification/notification.module';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [
    BookModule,
    NotificationModule,
    CartModule,
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
    ]),
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    PaymentService,
    MailService,
    {
      provide: Stripe,
      useValue: new Stripe(process.env.STRIPE_SECRET_KEY),
    },
  ],
})
export class OrderModule {}
