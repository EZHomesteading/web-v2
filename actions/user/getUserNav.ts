import authCache from "@/auth-cache";
import prisma from "@/lib/prismadb";

export interface NavUser {
  id: string;
  firstName: string | null;
  role: string;
  name: string;
  email: string;
  image: string | null;
  cart: {
    id: string;
    quantity: number;
    listing: {
      imageSrc: string[];
      quantityType: string;
      title: string;
      user: {
        id: string;
        name: string;
      };
    };
  }[];
  buyerOrders: {
    id: string;
    conversationId: string | null;
    status: number;
    updatedAt: Date;
    seller: {
      name: string;
    };
  }[];
  sellerOrders: {
    id: string;
    conversationId: string | null;
    status: number;
    updatedAt: Date;
    buyer: {
      name: string;
    };
  }[];
}
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

    if (!user) {
      return null;
    }
    return user;
  } catch (error: any) {
    throw new Error(error);
  }
}
