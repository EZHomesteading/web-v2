import { OrderStatus } from "@prisma/client";

interface StatusTextParams {
  isSeller: boolean;
  bName: string;
  sName: string;
}

const statusTextMap: Record<OrderStatus, (params: StatusTextParams) => string> =
  {
    [OrderStatus.PENDING]: ({ isSeller }) => (isSeller ? `` : ``),

    [OrderStatus.PAYMENT_FAILED]: ({ isSeller, bName }) =>
      isSeller ? `You have a new order from ${bName}` : ``,

    [OrderStatus.BUYER_PROPOSED_TIME]: ({ isSeller, sName, bName }) =>
      isSeller
        ? `You have a new order from ${bName}. Waiting on your responce`
        : `Waiting for ${sName} to confirm, reschedule, or deny your order.`,

    [OrderStatus.SELLER_ACCEPTED]: ({ isSeller, sName }) =>
      isSeller
        ? `You have accepted this pickup time`
        : `${sName} accepted your pick up time and is preparing your order`,

    [OrderStatus.SELLER_RESCHEDULED]: ({ isSeller, bName }) =>
      isSeller ? `${bName} has accepted your new pick up time` : ``,

    [OrderStatus.BUYER_ACCEPTED]: ({ isSeller, bName }) =>
      isSeller ? `${bName} has accepted your new drop off time` : ``,

    [OrderStatus.BUYER_RESCHEDULED]: ({ isSeller, bName }) =>
      isSeller ? `${bName} has proposed a new pick up time` : ``,

    [OrderStatus.SCHEDULE_CONFIRMED]: () => ``,

    [OrderStatus.READY_FOR_PICKUP]: ({ isSeller, sName }) =>
      isSeller
        ? `You have set this order as ready for pickup`
        : `Your order from ${sName} is ready for pickup`,

    [OrderStatus.PICKED_UP]: ({ isSeller, bName }) =>
      isSeller
        ? `${bName} has picked up their order`
        : `You have picked up this order`,

    [OrderStatus.SELLER_PROPOSED_DELIVERY_FEE]: ({ isSeller, sName }) =>
      isSeller ? `` : `${sName} has accepted your drop off time`,

    [OrderStatus.SCHEDULE_CONFIRMED_PAID]: ({ isSeller, sName }) =>
      isSeller ? `` : `${sName} has proposed a new drop off time`,

    [OrderStatus.SELLER_PREPARING]: ({ isSeller, sName }) =>
      isSeller
        ? `You are preparing this order`
        : `${sName} is preparing your order`,

    [OrderStatus.SELLER_PREPARING_EXPIRED]: ({ isSeller, bName }) =>
      isSeller ? `${bName} has proposed a new drop off time` : ``,

    [OrderStatus.IN_TRANSIT]: ({ isSeller, bName }) =>
      isSeller ? `You are transporting this roder` : `Your orde ris on the way`,

    [OrderStatus.DELIVERED]: ({ isSeller, sName }) =>
      isSeller
        ? `You have dropped off this order, awaiting confirmation`
        : `${sName} has dropped off your order, please confirm`,

    [OrderStatus.DELIVERY_CONFIRMED]: ({ isSeller, bName }) =>
      isSeller
        ? `${bName} confirmed your drop off, please leave a review`
        : `You have confirmed this order, please leave a review`,

    [OrderStatus.COMPLETED]: ({ isSeller, bName, sName }) =>
      isSeller
        ? `Please leave a review for ${bName}`
        : `Please leave a review for ${sName}`,

    [OrderStatus.CANCELED]: () => ``,

    [OrderStatus.REFUNDED]: () => ``,

    [OrderStatus.DISPUTED]: () => `This order has an active dispute.`,

    [OrderStatus.DISPUTE_UNDER_REVIEW]: () =>
      `This order has an active dispute. An admin has been notified and is reviewing your case`,

    [OrderStatus.DISPUTE_IN_SELLER_FAVOR]: () => ``,
    [OrderStatus.DISPUTE_IN_BUYER_FAVOR]: () => ``,
    [OrderStatus.ADMIN_RESOLVED_DISPUTE]: () => ``,
    [OrderStatus.BUYER_RESOLVED_DISPUTE]: () => ``,
    [OrderStatus.SELLER_RESOLVED_DISPUTE]: () => ``,
    [OrderStatus.ADMIN_MESSAGE]: () => ``,
    [OrderStatus.HARVEST]: () => ``,
    [OrderStatus.IMG]: () => ``,
    [OrderStatus.DISPUTEE_RESPONDED]: () => ``,
    [OrderStatus.DISPUTER_RESPONDED]: () => ``,
    [OrderStatus.BUYER_NO_SHOW]: () => ``,
    [OrderStatus.SELLER_NO_SHOW]: () => ``,
  };

export const getStatusText = (
  status: OrderStatus,
  isSeller: boolean,
  sName: string,
  bName: string
): string => {
  const getTextFn = statusTextMap[status];
  return getTextFn ? getTextFn({ isSeller, bName, sName }) : `Unknown status`;
};
