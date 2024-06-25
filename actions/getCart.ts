//action to get the current users cart
import prisma from "@/lib/prismadb";
import { currentUser } from "@/lib/auth";
import { JsonValue } from "@prisma/client/runtime/library";
import { Prisma, UserRole } from "@prisma/client";
export type Listing = {
  user: {
    id: string;
    name: string;
    role: string;
    SODT: number | null;
  };
  id: string;
  location: number;
  SODT: number | null;
  createdAt: Date;
  userId: string;
  price: number;
  title: string;
  subCategory: string;
  stock: number;
  quantityType: string;
  minOrder: number;
  imageSrc: string[];
  shelfLife: number;
};
export type Location = {
  type: string;
  coordinates: number[];
  address: string[];
  hours: Prisma.JsonValue;
};
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
    createdAt: string;
    location: {
      type: string;
      coordinates: number[];
      address: string[];
      hours: Prisma.JsonValue;
    };
    imageSrc: string[];
    userId: string;
    subCategory: string;
    minOrder: number;
    user: {
      id: string;
      SODT: number | null;
      name: string;
      role: UserRole;
      //hours: JsonValue;
    };
  };
};
const getUserLocation = async (listing: Listing) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: listing.user.id,
      },
      select: {
        location: { select: { [listing.location]: true } },
      },
    });

    return user?.location ? user?.location[listing.location] : undefined;
  } catch (error: any) {
    throw new Error(error);
  }
};
function filterListingsByLocation(listings: CartItem[]) {
  return listings.filter((listing: CartItem) => {
    return listing.listing.location !== undefined;
  });
}

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
                SODT: true,
                role: true,
              },
            },
          },
        },
      },
      orderBy: { listing: { userId: "desc" } },
    });
    const listerine = cartItems.map(async (cartItem) => {
      const location = (await getUserLocation(
        cartItem.listing
      )) as unknown as Location;

      const CartItem: CartItem = cartItem as unknown as CartItem;
      CartItem.listing.location = location;
      return {
        ...CartItem,
      };
    });
    let finalCartItems = await Promise.all(listerine);
    finalCartItems = filterListingsByLocation(finalCartItems);
    finalCartItems.sort((a, b) => {
      // First, sort by descending user ID
      if (b.listing.userId !== a.listing.userId) {
        return b.listing.userId.localeCompare(a.listing.userId);
      }

      // If user IDs are the same, sort by location
      const aCoord = a.listing.location?.coordinates[0] || 0;
      const bCoord = b.listing.location?.coordinates[0] || 0;
      return aCoord - bCoord;
    });
    return finalCartItems;
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
