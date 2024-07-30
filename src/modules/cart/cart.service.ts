import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Cart } from './schemas/cart.schema';
import { AddToCartDto } from './dto/addToCart.dto';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<Cart>) {}

  async addToCart(userId: string, addToCartDto: AddToCartDto) {
    let cart = await this.cartModel.findOne({ user: userId });

    if (!cart) {
      await this.cartModel.create({ user: userId, items: [addToCartDto] });
      return 'Book added to cart';
    }

    const existingItem = cart.items.find(
      (item) => item.bookId.toString() === addToCartDto.bookId.toString(),
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({ bookId: addToCartDto.bookId, quantity: 1 });
    }

    await cart.save();

    return 'Book added to cart';
  }

  async getCart(userId: string) {
    return (await this.cartModel.findOne({ user: userId })).populated(
      'items.bookId',
    );
  }

  async removeFromCart(userId: string, bookId: string) {
    const cart = await this.cartModel.findOne({ user: userId });

    cart.items = cart.items.filter((item) => item.bookId.toString() !== bookId);

    await cart.save();

    return 'Book removed from cart';
  }

  async clearCart(userId: string) {
    await this.cartModel.findOneAndUpdate({ user: userId }, { items: [] });

    return 'Cart cleared';
  }

  async decrementQuantity(userId: string, bookId: string) {
    const cart = await this.cartModel.findOne({ user: userId });

    const existingItem = cart.items.find(
      (item) => item.bookId.toString() === bookId,
    );

    if (!existingItem) {
      throw new BadRequestException('Book not found in cart.');
    }

    if (existingItem.quantity === 1) {
      cart.items = cart.items.filter(
        (item) => item.bookId.toString() !== bookId,
      );
    } else {
      existingItem.quantity -= 1;
    }

    await cart.save();

    return 'Book quantity decremented.';
  }

  async incrementQuantity(userId: string, bookId: string) {
    await this.addToCart(userId, {
      bookId,
    });

    return 'Book quantity incremented.';
  }
}
