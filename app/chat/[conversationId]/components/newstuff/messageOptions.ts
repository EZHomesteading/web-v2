import { OrderStatus, UserRole } from "@prisma/client";
import { MessageOption } from "chat-types";
import { PiCalendarCheckLight, PiCalendarBlankLight } from "react-icons/pi";

export const getMessageOptions = (
  orderStatus: OrderStatus,
  userRole: UserRole,
  isSeller: boolean
): MessageOption[] => {
  switch (orderStatus) {
    case OrderStatus.BUYER_PROPOSED_TIME:
      return isSeller ? [
        {
          icon: PiCalendarCheckLight,
          label: "Agree to Time",
          action: "ACCEPT_TIME",
          status: OrderStatus.SELLER_ACCEPTED
        },
        {
          icon: PiCalendarBlankLight,
          label: "Propose New Time",
          action: "PROPOSE_TIME",
          status: OrderStatus.SELLER_RESCHEDULED
        }
      ] : [];
    default:
      return [];
  }
};