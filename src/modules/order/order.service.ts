import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Stripe from 'stripe';

import { Order } from './schemas/order.schema';
import { CheckoutDto } from './dto/checkout.dto';
import { createLineItems } from './utils/createLineItems.order.util';
import { CreateOrderDto } from './dto/createOrder.dto';
import { PaymentService } from 'src/shared/services/payment.service';
import { BookService } from '../book/book.service';
import { MailService } from 'src/shared/services/mail.service';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    private readonly notificationService: NotificationService,
    private readonly paymentService: PaymentService,
    private readonly bookService: BookService,
    private readonly mailService: MailService,
  ) {}

  async checkout(items: CheckoutDto[], customerEmail: string) {
    const lineItems = createLineItems(items);

    const paymentSessionUrl = await this.paymentService.createPaymentSession(
      customerEmail,
      lineItems,
    );

    return paymentSessionUrl;
  }

  async createOrder(userId: string, createOrderDto: CreateOrderDto) {
    const { paymentSessionId } = createOrderDto;

    const paymentSession =
      await this.paymentService.reterivePaymentSession(paymentSessionId);
    const paymentIntent = paymentSession.payment_intent as Stripe.PaymentIntent;

    const isOrderAlreadyCreadted = await this.orderModel.findOne({
      'paymentResult.paymentIntent': paymentIntent.id,
    });

    if (isOrderAlreadyCreadted) {
      throw new BadRequestException('Order already created');
    }

    const order = {};
    if (paymentIntent.status === 'succeeded') {
      order['user'] = userId;

      const data =
        await this.paymentService.getPaymentLineItems(paymentSessionId);

      const items = (async () => {
        data.map(async (item) => {
          const book = await this.bookService.getBookByTitle(item.description);
          return {
            book: book._id.toString(),
            quantity: item.quantity,
          };
        });
      })();

      order['items'] = items;
      order['totalAmount'] = paymentSession.amount_total / 100;
      order['shippingAddress'] = paymentSession.shipping_details.address;
      order['paymentResult'] = {
        paymentIntent: paymentIntent.id,
        refundId: paymentIntent.latest_charge,
      };
    } else {
      throw new BadRequestException('Payment not verified.');
    }

    this.sendMailOfOrderConfirmation(
      order as Order,
      paymentSession.customer_email,
    );

    const newOrder = await this.orderModel.create(order);

    // await this.notificationService.
    // Staert from herer

  }

  private async sendMailOfOrderConfirmation(order: Order, email: string) {
    const bookIdsList = order.items.map((item) => String(item.book));
    const books = await this.bookService.getBooksByIds(bookIdsList);

    const emailData = [];

    books.forEach((book) => {
      const data = {
        title: book.title,
        author: book.author,
        price: book.price,
        quantity: order.items.find(
          (item) => item.book.toString() === book._id.toString(),
        ).quantity,
      };
      emailData.push(data);
    });

    emailData.push({
      totalAmount: order.totalAmount,
      shippingAddress: order.shippingAddress,
      paymentMethod: order.paymentMethod,
    });

    await this.mailService.sendMail({
      email,
      subject: "Order Details",
      template: "order-summary.ejs",
      data: emailData,
    });
  }
}
