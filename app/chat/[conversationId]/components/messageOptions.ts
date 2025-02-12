import { OrderStatus, UserRole, fulfillmentType } from "@prisma/client";
import { MessageOption } from "chat-types";
import {
  PiCalendarCheckLight,
  PiCalendarBlankLight,
  PiCalendarPlusLight,
  PiCalendarXLight,
} from "react-icons/pi";

export const getMessageOptions = (
  orderStatus: OrderStatus | null,
  fulfillmentType: fulfillmentType,
  userRole: UserRole,
  isSeller: boolean,
  // setCustomTimeOpen: (open: boolean) => void,
  setCancelOpen: (open: boolean) => void,
  setDisputeOpen: (open: boolean) => void,

  dateTime?: boolean
): MessageOption[] => {
  switch (true) {
    // Seller-only actions
    case isSeller &&
      (orderStatus === OrderStatus.BUYER_PROPOSED_TIME ||
        orderStatus === OrderStatus.BUYER_RESCHEDULED): {
      if (fulfillmentType === "DELIVERY") {
        return [
          {
            icon: PiCalendarCheckLight,
            label: "Accept Time",
            status: OrderStatus.SELLER_ACCEPTED,
          },
          {
            icon: PiCalendarBlankLight,
            label: "Send Delivery Time Offer",
            status: OrderStatus.SELLER_RESCHEDULED,
          },
          // ...(dateTime
          //   ? [
          //       {
          //         icon: PiCalendarPlusLight,
          //         label: "Set Different Time",
          //         status: OrderStatus.SELLER_RESCHEDULED,
          //         onClick: () => setCustomTimeOpen?.(true),
          //       },
          //     ]
          //   : [
          //       {
          //         icon: PiCalendarPlusLight,
          //         label: "Set Delivery Time",
          //         status: OrderStatus.SELLER_RESCHEDULED,
          //         onClick: () => setCustomTimeOpen?.(true),
          //       },
          //     ]),
          {
            icon: PiCalendarXLight,
            label: "Cancel Order",
            status: OrderStatus.CANCELED,
            onClick: () => setCancelOpen?.(true),
          },
        ];
      }

      return [
        {
          icon: PiCalendarCheckLight,
          label: "Agree to Time",
          status: OrderStatus.SELLER_ACCEPTED,
        },
        // {
        //   icon: PiCalendarBlankLight,
        //   label: "Propose New Time",
        //   status: OrderStatus.SELLER_RESCHEDULED,
        // },
        // ...(dateTime
        //   ? [
        //       {
        //         icon: PiCalendarPlusLight,
        //         label: "Set New Reschedule Time",
        //         status: OrderStatus.SELLER_RESCHEDULED,
        //         onClick: () => setCustomTimeOpen?.(true),
        //       },
        //     ]
        //   : [
        //       {
        //         icon: PiCalendarPlusLight,
        //         label: "Reschedule Time",
        //         status: OrderStatus.SELLER_RESCHEDULED,
        //         onClick: () => setCustomTimeOpen?.(true),
        //       },
        //     ]),
        {
          icon: PiCalendarXLight,
          label: "Cancel Order",
          status: OrderStatus.CANCELED,
          onClick: () => setCancelOpen?.(true),
        },
      ];
    }

    case isSeller && orderStatus === OrderStatus.SELLER_ACCEPTED: {
      if (fulfillmentType === "DELIVERY") {
        return [
          {
            icon: PiCalendarCheckLight,
            label: "Order On the way",
            status: OrderStatus.IN_TRANSIT,
          },
        ];
      }
      return [
        {
          icon: PiCalendarCheckLight,
          label: "Preparing Order",
          status: OrderStatus.SELLER_PREPARING,
        },
      ];
    }

    // Buyer-only actions for delivery/pickup confirmation
    case (orderStatus === OrderStatus.DELIVERED ||
      orderStatus === OrderStatus.READY_FOR_PICKUP) &&
      !isSeller: {
      return [
        {
          icon: PiCalendarCheckLight,
          label: "Confirm Order",
          status: OrderStatus.PICKED_UP,
        },
        {
          icon: PiCalendarPlusLight,
          label: "Dispute Transaction",
          status: OrderStatus.DISPUTED,
          onClick: () => setDisputeOpen?.(true),
        },
      ];
    }

    // Seller-only action after pickup
    case orderStatus === OrderStatus.PICKED_UP && isSeller: {
      return [
        {
          icon: PiCalendarCheckLight,
          label: "Thank Buyer",
          status: OrderStatus.COMPLETED,
        },
      ];
    }

    // Seller photo upload requirements
    case (orderStatus === OrderStatus.SELLER_PREPARING ||
      orderStatus === OrderStatus.IN_TRANSIT) &&
      isSeller: {
      return [
        {
          icon: PiCalendarCheckLight,
          label:
            fulfillmentType === "DELIVERY"
              ? "Upload Delivery Photo"
              : "Upload Ready for Pickup Photo",
          status:
            fulfillmentType === "DELIVERY"
              ? OrderStatus.DELIVERED
              : OrderStatus.READY_FOR_PICKUP,
          requiresPhoto: true,
        },
      ];
    }

    // Rescheduling options
    case orderStatus === OrderStatus.SELLER_RESCHEDULED && !isSeller: {
      return [
        {
          icon: PiCalendarCheckLight,
          label:
            fulfillmentType === "DELIVERY"
              ? "Accept Delivery Time"
              : "Agree to Time",
          status: OrderStatus.BUYER_ACCEPTED,
        },
        // ...(dateTime
        //   ? [
        //       {
        //         icon: PiCalendarBlankLight,
        //         label:
        //           fulfillmentType === "DELIVERY"
        //             ? "Send Delivery Time Offer"
        //             : "Send Reschedule Offer",
        //         status: OrderStatus.BUYER_RESCHEDULED,
        //       },
        //       {
        //         icon: PiCalendarPlusLight,
        //         label:
        //           fulfillmentType === "DELIVERY"
        //             ? "Set Different Time"
        //             : "Set New Reschedule Time",
        //         onClick: () => setCustomTimeOpen?.(true),
        //         status: OrderStatus.BUYER_RESCHEDULED,
        //       },
        //     ]
        //   : [
        //       {
        //         icon: PiCalendarPlusLight,
        //         label:
        //           fulfillmentType === "DELIVERY"
        //             ? "Set Delivery Time"
        //             : "Reschedule Time",
        //         onClick: () => setCustomTimeOpen?.(true),
        //         status: OrderStatus.BUYER_RESCHEDULED,
        //       },
        //     ]),
      ];
    }

    default:
      return [];
  }
};
