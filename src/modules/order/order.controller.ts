import { Body, Controller, Post, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { CheckoutDto } from './dto/checkout.dto';
import { Request } from 'express';
import { CreateOrderDto } from './dto/createOrder.dto';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('checkout')
  async checkout(@Req() req: Request, @Body() items: CheckoutDto[]) {
    const customerEmail = req.user.email;

    return this.orderService.checkout(items, customerEmail);
  }

  @Post('create')
  async createOrder(@Req()req: Request, @Body() createOrderDto: CreateOrderDto) {
    const userId = req.user._id.toString()

    return this.orderService.createOrder(userId, createOrderDto);
  }
}
