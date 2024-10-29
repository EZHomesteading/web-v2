declare module "order-types" {
  type navSellOrder = {
    id: string;
    conversationId: string | null;
    status: string;
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
    status: string;
    updatedAt: Date;
    seller: {
      name: string;
    } | null;
    buyer: {
      name: string;
    } | null;
  };
}
