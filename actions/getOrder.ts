// action to get Stripe transfer information based on order ID
import prisma from "@/lib/prismadb";

interface Params {
  orderId?: string;
}

const getOrderByIdTransfer = async (params: Params) => {
  try {
    const { orderId } = params;

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      select: {
        totalPrice: true,
        status: true,
        id: true,
        seller: {
          select: {
            stripeAccountId: true,
          },
        },
      },
    });

    if (!order) {
      return null;
    }

    return order;
  } catch (error: any) {
    throw new Error(error);
  }
};

const getOrderById = async (params: Params) => {
  try {
    const { orderId } = params;

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });

    if (!order) {
      return null;
    }

    return order;
  } catch (error: any) {
    throw new Error(error);
  }
};

const GetOrderByConvoId = async (conversationId: string) => {
  try {
    if (!conversationId) {
      return null;
    }

    const order = await prisma.order.findFirst({
      where: {
        conversationId,
      },
    });

    if (!order) {
      return null;
    }

    return { ...order };
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  }
};

export { getOrderById, getOrderByIdTransfer, GetOrderByConvoId };
