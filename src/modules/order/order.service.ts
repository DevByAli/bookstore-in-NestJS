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
import { CartService } from '../cart/cart.service';
import { GetOrdersDto } from './dto/getOrders.dto';
import { ROLE_ADMIN } from 'src/utils/constants';
import formatOrder from 'src/utils/formatOder';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    private readonly notificationService: NotificationService,
    private readonly paymentService: PaymentService,
    private readonly bookService: BookService,
    private readonly mailService: MailService,
    private readonly cartService: CartService,
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

    if (!paymentSession) {
      throw new BadRequestException('Invalid payment session id.');
    }

    // Rename the PaymentIntent properties
    const {
      id: paymentId,
      status: paymentStatus,
      latest_charge: refundId,
    } = paymentSession.payment_intent as Stripe.PaymentIntent;

    if (paymentStatus !== 'succeeded') {
      throw new BadRequestException('Payment not verified.');
    }

    const isOrderAlreadyCreadted = await this.orderModel.findOne({
      'paymentResult.paymentId': paymentId,
    });

    if (isOrderAlreadyCreadted) {
      throw new BadRequestException('Order already created.');
    }

    const order = {};
    order['userId'] = userId;

    const itemsInPaymentBill =
      await this.paymentService.getItemsInPaymentBill(paymentSessionId);

    order['items'] = itemsInPaymentBill;
    order['totalAmount'] = paymentSession.amount_total / 100;
    order['shippingAddress'] = paymentSession.shipping_details.address;
    order['paymentResult'] = { paymentId, refundId };

    const newOrder = await this.orderModel.create(order);
    await this.cartService.clearCart(userId);

    const orderId = newOrder._id.toString();

    this.notificationService.createNotification(userId, orderId);

    this.sendMailOfOrderConfirmation(
      order as Order,
      paymentSession.customer_email,
    );

    return newOrder;
  }

  private async sendMailOfOrderConfirmation(order: Order, email: string) {
    const bookIdsList = order.items.map((item) => String(item.bookId));
    const books = await this.bookService.getBooksByIds(bookIdsList);

    const emailData = [];

    books.forEach((book) => {
      const data = {
        title: book.title,
        author: book.author,
        price: book.price,
        quantity: order.items.find(
          (item) => item.bookId.toString() === book._id.toString(),
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
      subject: 'Order Details',
      template: 'order-summary.ejs',
      data: emailData,
    });
  }

  async getOrders(getOrderDto: GetOrdersDto, userId: string, userRole: string) {
    const { page, limit, sortOrder, status } = getOrderDto;

    const isAdmin = userRole === ROLE_ADMIN ? true : false;

    const searchFilter = { status };
    if (!isAdmin) {
      searchFilter['user'] = userId;
    }

    const { sort, skip } = {
      sort: { createdAt: sortOrder },
      skip: (page - 1) * limit,
    };

    const [orders, totalOrderCount] = await Promise.all([
      this.orderModel.find(searchFilter).sort(sort).limit(limit).skip(skip),
      this.orderModel.countDocuments(searchFilter),
    ]);

    const formattedOrder = formatOrder(orders);

    const hasNextPage = totalOrderCount > skip + limit;

    return { orders: formattedOrder, hasNextPage };
  }
}
