import authCache from "@/auth-cache";
import { currentUser } from "@/lib/auth";
import prisma from "@/lib/prismadb";

export default async function GetNavUser() {
  const session = await authCache();
  const User = session?.user;
  if (!User) {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: User?.id,
      },
      select: {
        id: true,
        firstName: true,
        role: true,
        name: true,
        email: true,
        image: true,
        cart: {
          select: {
            id: true,
            quantity: true,
            listing: {
              select: {
                imageSrc: true,
                quantityType: true,
                title: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
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
