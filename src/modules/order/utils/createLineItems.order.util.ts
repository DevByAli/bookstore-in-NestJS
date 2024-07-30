import modifyCloudinaryUrl from 'src/utils/modifyCloudinaryUrl';
import { CheckoutDto } from '../dto/checkout.dto';
import { PaymentLineItem } from 'src/shared/types/paymentLineItems.type';

export const createLineItems = (items: CheckoutDto[]): PaymentLineItem[] => {
  return items.map(({ book, quantity }) => {
    const modifiedUrl = modifyCloudinaryUrl(book.url, 200, 300);

    return {
      price_data: {
        currency: 'usd',
        product_data: {
          name: book.title,
          images: [modifiedUrl],
        },
        unit_amount: book.price * 100,
      },
      quantity: quantity,
    };
  });
};
