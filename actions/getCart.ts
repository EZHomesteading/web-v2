import prisma from "@/lib/prismadb";
import { currentUser } from "@/lib/auth";
import { orderBy } from "lodash";

export const getAllCartItemsByUserId = async () => {
  const user = await currentUser();
  try {
    const cartItems = await prisma.cart.findMany({
      where: {
        userId: user!.id,
      },
      include: {
        user: true,
        listing: { include: { user: true } },
      },
      orderBy: { listing: { userId: "desc" } },
    });
    return cartItems;
  } catch (error: any) {
    return [];
  }
};

export const getCartItemById = async (cartId: string) => {
  try {
    const cartItem = await prisma.cart.findUnique({
      where: {
        id: cartId,
      },
      include: {
        user: true,
      },
    });

    if (!cartItem) {
      return null;
    }

    return {
      ...cartItem,
      user: {
        ...cartItem.user,
        createdAt: cartItem.user.createdAt?.toString(),
      },
    };
  } catch (error: any) {
    throw new Error(error);
  }
};
