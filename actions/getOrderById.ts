import prisma from "@/lib/prismadb";

interface Params {
  orderId?: string;
}

export default async function getOrderById(params: Params) {
  try {
    const { orderId } = params;

    const user = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });

    if (!user) {
      return null;
    }

    return user;
  } catch (error: any) {
    throw new Error(error);
  }
}
