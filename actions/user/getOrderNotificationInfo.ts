import { currentUser } from "@/lib/auth";
import prisma from "@/lib/prismadb";

export default async function GetOrderNotificationInfo() {
  const currentUserr = await currentUser();
  if (!currentUserr) {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: currentUserr?.id,
      },
      select: {
        firstName: true,
        role: true,
        name: true,
        image: true,
        buyerOrders: {
          select: {
            id: true,
            conversationId: true,
            status: true,
            updatedAt: true,
            seller: {
              select: {
                name: true,
              },
            },
          },
        },
        sellerOrders: {
          select: {
            id: true,
            conversationId: true,
            status: true,
            updatedAt: true,
            buyer: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (user) {
      user.firstName = user.firstName ?? "";
      return user;
    }
    return null;
  } catch (error: any) {
    throw new Error(error);
  }
}
