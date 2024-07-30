import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/addToCart.dto';
import { Request } from 'express';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Post()
  async addToCart(@Req() req: Request, @Body() addToCartDto: AddToCartDto) {
    const userId = req.user._id;

    return await this.cartService.addToCart(userId, addToCartDto);
  }

  @Get()
  async getCart(@Req() req: Request) {
    const userId = req.user._id;

    return await this.cartService.getCart(userId);
  }

  @Delete('remove/:id')
  async removeFromCart(@Req() req: Request, @Param('id') bookId: string) {
    const userId = req.user._id;

    return await this.cartService.removeFromCart(userId, bookId);
  }

  @Patch('clear')
  async clearCart(@Req() req: Request) {
    const userId = req.user._id;

    return await this.cartService.clearCart(userId);
  }

  @Patch('increment/:id')
  async incrementQuantity(@Req() req: Request, @Param('id') bookId: string) {
    const userId = req.user._id;

    return await this.cartService.incrementQuantity(userId, bookId);
  }

  @Patch('decrement/:id')
  async decrementQuantity(@Req() req: Request, @Param('id') bookId: string) {
    const userId = req.user._id;

    return await this.cartService.decrementQuantity(userId, bookId);
  }
}
