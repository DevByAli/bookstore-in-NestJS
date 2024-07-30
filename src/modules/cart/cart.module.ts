import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Cart, CartSchema } from './schemas/cart.schema';
import { IdValidationMiddleware } from 'src/middlewares/IdValidation.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IdValidationMiddleware)
      .forRoutes(
          { path: 'cart/remove/:id', method: RequestMethod.DELETE },
          { path: 'cart/increment/:id', method: RequestMethod.PATCH },
          { path: 'cart/decrement/:id', method: RequestMethod.PATCH },
      );
  }
}
