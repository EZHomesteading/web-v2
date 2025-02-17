import { OrderStatus } from "@prisma/client";

declare module "order-types" {
  type navSellOrder = {
    id: string;
    conversationId: string | null;
    status: OrderStatus;
    updatedAt: Date;
    seller: {
      name: string;
    } | null;
    buyer: {
      name: string;
    } | null;
  };

  type navBuyOrder = {
    id: string;
    conversationId: string | null;
    status: OrderStatus;
    updatedAt: Date;
    seller: {
      name: string;
    } | null;
    buyer: {
      name: string;
    } | null;
  };
}
