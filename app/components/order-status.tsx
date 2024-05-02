import { UserRole } from "@prisma/client";

const statusTextMap: Record<
  number,
  (params: {
    buyerName?: string;
    sellerName?: string;
    userRole: UserRole;
  }) => string
> = {
  1: ({ buyerName, sellerName, userRole }) =>
    userRole === UserRole.COOP
      ? `${buyerName} created a new order.`
      : `Waiting for ${sellerName} to confirm, reschedule, or deny your order.`,
  2: ({ buyerName, sellerName, userRole }) =>
    userRole === UserRole.COOP
      ? `${buyerName} is waiting for their order to be ready for pickup.`
      : `${sellerName} is preparing your order.`,
  3: ({ buyerName, sellerName, userRole }) =>
    userRole === UserRole.COOP
      ? `Waiting for ${buyerName} to respond to your new pickup time.`
      : `${sellerName} has proposed a new pickup time.`,
  4: ({ sellerName, userRole }) =>
    userRole === UserRole.COOP
      ? `You canceled this order`
      : `${sellerName} has canceled the order. You can see their reason why in the conversation.`,
  5: ({ buyerName, sellerName, userRole }) =>
    userRole === UserRole.COOP
      ? `${buyerName} has accepted your new pickup time and is waiting for their order to be ready for pickup.`
      : `${sellerName} is preparing your order.`,
  6: ({ buyerName, sellerName, userRole }) =>
    userRole === UserRole.COOP
      ? `${buyerName} has proposed a different pickup time.`
      : `Waiting for ${sellerName} to respond to your new pickup time.`,
  7: ({ buyerName, userRole }) =>
    userRole === UserRole.COOP
      ? `${buyerName} canceled this order.`
      : `You canceled this order.`,
  8: ({ buyerName, userRole }) =>
    userRole === UserRole.COOP
      ? `Waiting for ${buyerName} to pick up the order.`
      : `Your order is ready for pickup.`,
  9: ({ buyerName, sellerName, userRole }) =>
    userRole === UserRole.COOP
      ? `${buyerName} has picked up their order, please leave a review for them.`
      : `Please leave a review for ${sellerName}.`,

  10: ({ buyerName, sellerName, userRole }) =>
    userRole === UserRole.COOP
      ? `${sellerName} is preparing your order.`
      : `${buyerName} is waiting for their order to be ready for dropped. Payment pending delivery.`,
  11: ({ buyerName, sellerName, userRole }) =>
    userRole === UserRole.COOP
      ? `${sellerName} has proposed a new drop off time.`
      : `Waiting for ${buyerName} to respond to your new drop off time.`,
  12: ({ buyerName, sellerName, userRole }) =>
    userRole === UserRole.COOP
      ? `${sellerName} has canceled the order. You can see their reason why in the conversation.`
      : `You canceled this order`,
  13: ({ buyerName, sellerName, userRole }) =>
    userRole === UserRole.COOP
      ? `${sellerName} is preparing your order.`
      : `${buyerName} has accepted your new drop off time, payment pending delivery.`,
  14: ({ buyerName, sellerName, userRole }) =>
    userRole === UserRole.COOP
      ? `Waiting for ${sellerName} to respond to your new drop off time.`
      : `${buyerName} has proposed a different drop off time.`,
  15: ({ buyerName, userRole }) =>
    userRole === UserRole.COOP
      ? `You canceled this order.`
      : `${buyerName} canceled this order`,
  16: ({ sellerName, userRole }) =>
    userRole === UserRole.COOP
      ? `${sellerName} has dropped your order, please confirm this is true.`
      : `Waiting for your confirmation that the order was dropped off.`,
  17: ({ sellerName, userRole }) =>
    userRole === UserRole.COOP
      ? `Please leave a review.`
      : `Please leave a review for ${sellerName}.`,
  18: ({ sellerName, userRole }) =>
    userRole === UserRole.COOP
      ? `Please leave a review.`
      : `Please leave a review for ${sellerName}.`,
  19: () => `Complete`,
};

export const getStatusText = (
  statusNumber: number,
  buyerName: string,
  sellerName: string,
  userRole: UserRole
) => {
  const getTextFn = statusTextMap[statusNumber];
  return getTextFn
    ? getTextFn({ buyerName, sellerName, userRole })
    : "Unknown status";
};
