const statusTextMap: Record<
  number,
  (params: {
    isSeller: boolean;
    buyerName?: string;
    sellerName?: string;
  }) => string
> = {
  1: ({ buyerName, sellerName, isSeller }) =>
    isSeller
      ? `${buyerName} created a new order.`
      : `Waiting for ${sellerName} to confirm, reschedule, or deny your order.`,
  2: ({ buyerName, sellerName, isSeller }) =>
    isSeller
      ? `${buyerName} is waiting for their order to be ready for pickup.`
      : `${sellerName} is preparing your order.`,
  3: ({ buyerName, sellerName, isSeller }) =>
    isSeller
      ? `Waiting for ${buyerName} to respond to your new pickup time.`
      : `${sellerName} has proposed a new pickup time.`,
  4: ({ sellerName, isSeller }) =>
    isSeller
      ? `You canceled this order`
      : `${sellerName} has canceled the order. You can see their reason why in the conversation.`,
  5: ({ buyerName, sellerName, isSeller }) =>
    isSeller
      ? `${buyerName} has accepted your new pickup time and is waiting for their order to be ready for pickup.`
      : `${sellerName} is preparing your order.`,
  6: ({ buyerName, sellerName, isSeller }) =>
    isSeller
      ? `${buyerName} has proposed a different pickup time.`
      : `Waiting for ${sellerName} to respond to your new pickup time.`,
  7: ({ buyerName, isSeller }) =>
    isSeller
      ? `${buyerName} cancelled this order.`
      : `You canceled this order.`,
  8: ({ buyerName, isSeller }) =>
    isSeller
      ? `Waiting for ${buyerName} to pick up the order.`
      : `Your order is ready for pickup.`,
  9: ({ buyerName, sellerName, isSeller }) =>
    isSeller
      ? `${buyerName} has picked up their order, please leave a review for them.`
      : `Please leave a review for ${sellerName}.`,

  10: ({ buyerName, sellerName, isSeller }) =>
    isSeller
      ? `${sellerName} is preparing your order.`
      : `${buyerName} is waiting for their order to be ready for dropped. Payment pending delivery.`,
  11: ({ buyerName, sellerName, isSeller }) =>
    isSeller
      ? `${sellerName} has proposed a new drop off time.`
      : `Waiting for ${buyerName} to respond to your new drop off time.`,
  12: ({ buyerName, sellerName, isSeller }) =>
    isSeller
      ? `${buyerName} has canceled the order. You can see their reason why in the conversation.`
      : `You canceled this order`,
  13: ({ buyerName, sellerName, isSeller }) =>
    isSeller
      ? `${sellerName} is preparing your order.`
      : `${buyerName} has accepted your new drop off time, payment pending delivery.`,
  14: ({ buyerName, sellerName, isSeller }) =>
    isSeller
      ? `Waiting for ${sellerName} to respond to your new drop off time.`
      : `${buyerName} has proposed a different drop off time.`,
  15: ({ buyerName, isSeller }) =>
    isSeller ? `You canceled this order.` : `${buyerName} canceled this order`,
  16: ({ sellerName, isSeller }) =>
    isSeller
      ? `${sellerName} has dropped your order, please confirm this is true.`
      : `Waiting for your confirmation that the order was dropped off.`,
  17: ({ sellerName, isSeller }) =>
    isSeller
      ? `Please leave a review.`
      : `Please leave a review for ${sellerName}.`,
  18: ({ sellerName, isSeller }) =>
    isSeller
      ? `Please leave a review.`
      : `Please leave a review for ${sellerName}.`,
  19: () => `Complete`,
  20: () => `An administrator has cancelled this order and refunded it.`,
  21: () => `An administrator has marked this order as complete.`,
  22: ({ sellerName, isSeller }) =>
    isSeller
      ? `You refunded this order`
      : `${sellerName} has refunded the order. You can see their reason why in the conversation.`,
  23: () => `This order has an active dispute.`,
  24: () =>
    `This order has an active dispute. An admin has been notified and is reviewing your case`,
};

export const getStatusText = (
  statusNumber: number,
  isSeller: boolean,
  buyerName: string,
  sellerName: string
) => {
  const getTextFn = statusTextMap[statusNumber];
  return getTextFn
    ? getTextFn({ isSeller, buyerName, sellerName })
    : "Unknown status";
};
