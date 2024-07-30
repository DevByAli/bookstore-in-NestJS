export default function formatOrder(orders: any[]) {
  orders.map((order) => ({
    id: order._id,
    status: order.status,
    totalAmount: order.totalAmount,
    shippingAddress: order.shippingAddress,
    items: order.items.map((item) => ({
      book: item.bookId,
      quantity: item.quantity,
    })),
    user: {
      id: order.user._id,
      username: order.user.username,
      email: order.user.email,
      avatar: order.user.avatar,
    },
    date: order.createdAt,
  }));
}
