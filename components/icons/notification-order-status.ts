// needs refactor based on new order status enum
const statusTextMap: Record<
  number,
  (params: { isSeller: boolean; bName: string; sName: string }) => string
> = {
  0: ({ isSeller }) => (isSeller ? `` : ``),
  1: ({ isSeller, bName }) =>
    isSeller ? `You have a new order from ${bName}` : ``,
  2: ({ isSeller, sName }) =>
    isSeller
      ? ``
      : `${sName} accepted your pick up time and is preparing your order`,
  3: ({ isSeller, sName }) =>
    isSeller
      ? ``
      : `Waiting for ${sName} to confirm, reschedule, or deny your order.`,
  4: () => ``,
  5: ({ isSeller, bName }) =>
    isSeller ? `${bName} has accepted your new pick up time` : ``,
  6: ({ isSeller, bName }) =>
    isSeller ? `${bName} has proposed a new pick up time` : ``,
  7: () => ``,
  8: ({ isSeller, sName }) =>
    isSeller ? `` : `Your order from ${sName} is ready for pickup`,
  9: ({ isSeller, bName }) =>
    isSeller ? `${bName} has picked up their order` : ``,
  10: ({ isSeller, sName }) =>
    isSeller ? `` : `${sName} has accepted your drop off time`,
  11: ({ isSeller, sName }) =>
    isSeller ? `` : `${sName} has proposed a new drop off time`,
  12: ({ isSeller, sName }) =>
    isSeller
      ? `A new order has been created.`
      : `${sName} has canceled your order`,
  13: ({ isSeller, bName }) =>
    isSeller ? `${bName} has accepted your new drop off time` : ``,
  14: ({ isSeller, bName }) =>
    isSeller ? `${bName} has proposed a new drop off time` : ``,
  15: ({ isSeller, bName }) =>
    isSeller ? `${bName} has canceled their order` : ``,
  16: ({ isSeller, sName }) =>
    isSeller ? `` : `${sName} has dropped off your order, please confirm`,
  17: ({ isSeller, bName }) =>
    isSeller ? `${bName} confirmed your drop off, please leave a review` : ``,
  18: ({ isSeller, bName, sName }) =>
    isSeller
      ? `Please leave a review for ${bName}`
      : `Please leave a review for ${sName}`,
  19: () => ``,
  20: () => ``,
  21: () => ``,
  22: () => ``,
  23: () => `This order has an active dispute.`,
  24: () =>
    `This order has an active dispute. An admin has been notified and is reviewing your case`,
};

export const getStatusText = (
  statusNumber: number,
  isSeller: boolean,
  sName: string,
  bName: string
) => {
  const getTextFn = statusTextMap[statusNumber];
  return getTextFn ? getTextFn({ isSeller, bName, sName }) : `Unknown status`;
};
