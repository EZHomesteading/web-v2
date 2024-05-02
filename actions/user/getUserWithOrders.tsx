import prisma from "@/lib/prismadb";

interface Params {
  userId?: string;
}

export default async function getUserWithOrders(params: Params) {
  try {
    const { userId } = params;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        buyerOrders: true,
        sellerOrders: true,
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
