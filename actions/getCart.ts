//action to get the current users cart
import prisma from "@/lib/prismadb";
import { currentUser } from "@/lib/auth";
import { JsonValue } from "@prisma/client/runtime/library";
export type CartItem = {
  id: string;
  quantity: number;
  listing: {
    id: string;
    title: string;
    price: number;
    stock: number;
    SODT: number | null;
    quantityType: string | null;
    shelfLife: number;
    createdAt: Date;
    location: {
      type: string;
      coordinates: number[];
      address: string[];
      hours: JsonValue;
    } | null;
    imageSrc: string[];
    userId: string;
    subCategory: string;
    minOrder: number | null;
    user: {
      id: string;
      SODT: number | null;
      name: string;
      //hours: JsonValue;
    };
  };
};
const getAllCartItemsByUserId = async () => {
  const user = await currentUser();
  try {
    const cartItems = await prisma.cart.findMany({
      where: {
        userId: user!.id,
      },
      select: {
        id: true,
        quantity: true,

        listing: {
          select: {
            id: true,
            title: true,
            price: true,
            stock: true,
            SODT: true,
            quantityType: true,
            location: true,
            minOrder: true,

            shelfLife: true,
            createdAt: true,
            imageSrc: true,
            userId: true,
            subCategory: true,
            user: {
              select: {
                id: true,
                name: true,
                // hours: true,
                SODT: true,
                role: true,
              },
            },
          },
        },
      },
      orderBy: { listing: { userId: "desc" } },
    });
    return cartItems;
  } catch (error: any) {
    return [];
  }
};

const getCartItemById = async (cartId: string) => {
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

export { getAllCartItemsByUserId, getCartItemById };
