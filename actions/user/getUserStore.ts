import prisma from "@/lib/prismadb";
import { ExtendedHours } from "@/next-auth";
import { JsonValue } from "@prisma/client/runtime/library";

interface Params {
  userId?: string;
}
export type StoreUser = {
  id: string;
  name: string;
  firstName: string | null;
  image: string | null;
  bio: string | null;
  createdAt: Date;
  role: string;
  hours: ExtendedHours | undefined | null;
  listings: {
    imageSrc: string;
    title: string;
    price: number;
    id: string;
    quantityType: string;
    location: {
      address: string;
    } | null;
  }[];
  sellerReviews: {
    id: string;
    review: string;
    rating: number;
    buyer: {
      id: string;
      name: string;
      firstName: string | null;
      image: string | null;
    };
  }[];
};
export default async function getUserStore(params: Params) {
  try {
    const { userId } = params;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        firstName: true,
        image: true,
        bio: true,
        createdAt: true,
        role: true,
        hours: true,
        listings: {
          select: {
            imageSrc: true,
            title: true,
            price: true,
            id: true,
            quantityType: true,
            location: {
              select: {
                address: true,
              },
            },
          },
        },
        sellerReviews: {
          select: {
            id: true,
            review: true,
            rating: true,
            buyer: {
              select: {
                id: true,
                name: true,
                firstName: true,
                image: true,
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
