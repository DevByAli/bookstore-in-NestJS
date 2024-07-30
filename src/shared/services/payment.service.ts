import { BadRequestException, Injectable } from '@nestjs/common';
import {
    MAX_BUSINESS_DAYS,
    MIN_BUSINESS_DAYS,
    SHIPPING_PRICE,
} from 'src/utils/constants';
import Stripe from 'stripe';

import { PaymentLineItem } from '../types/paymentLineItems.type';
import { BookService } from 'src/modules/book/book.service';

@Injectable()
export class PaymentService {
  constructor(private readonly stripe: Stripe, private readonly bookService: BookService) {}

  async createPaymentSession(
    customerEmail: string,
    lineItems: PaymentLineItem[],
  ) {
    const { url: paymentSessionUrl } = await this.stripe.checkout.sessions.create({
        customer_email: customerEmail,
        line_items: lineItems,
        mode: 'payment',
        shipping_address_collection: {
          allowed_countries: ['PK', 'US', 'CN', 'IN', 'AE', 'GB'],
        },
        shipping_options: [
          {
            shipping_rate_data: {
              type: 'fixed_amount',
              fixed_amount: { amount: SHIPPING_PRICE, currency: 'usd' },
              display_name: 'Standard shipping',
              delivery_estimate: {
                minimum: { unit: 'business_day', value: MIN_BUSINESS_DAYS },
                maximum: { unit: 'business_day', value: MAX_BUSINESS_DAYS },
              },
            },
          },
        ],
        success_url: `${process.env.PAYMENT_SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}` as string,
        cancel_url: `${process.env.PAYMENT_CANCEL_URL}` as string,
      });

    return paymentSessionUrl;
  }

  async reterivePaymentSession(sessionId: string): Promise<Stripe.Response<Stripe.Checkout.Session>> {
    const paymentSession = await this.stripe.checkout.sessions.retrieve(
      sessionId,
      {
        expand: ['payment_intent.payment_method'],
      },
    );

    if (!paymentSession) {
      throw new BadRequestException('Invalid session id.');
    }

    return paymentSession;
  }

  async getItemsInPaymentBill(sessionId: string){
    const { data } = await this.stripe.checkout.sessions.listLineItems(sessionId);
   
    const paymentBillItems = data.map(async (item) => {
      const book = await this.bookService.getBookByTitle(item.description);
      return {
        book: book._id.toString(),
        quantity: item.quantity,
      };
    });

    return paymentBillItems
  }
}
