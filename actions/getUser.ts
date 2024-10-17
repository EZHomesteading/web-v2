import prisma from "@/lib/prismadb";
import { UserRole } from "@prisma/client";
import authCache from "@/auth-cache";
import { Location } from "@prisma/client";

interface p {
  role: UserRole;
}

interface Params {
  userId?: string;
}
interface IStoreParams {
  url?: string;
}

interface GetLocationByIndexParams {
  userId: string;
  index: 0 | 1 | 2;
}

const getLocationByIndex = async ({ userId, index }: GetLocationByIndexParams) => {
   if (!userId) {
    throw new Error("User ID is required");
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include:{
        locations:true
      }
    });
    console.log("user with locations")
    if (!user || !user.locations) {
      return null;
    }

    const locationObject = user.locations;
    const location = locationObject[index];

    if (!location) {
      return null;
    }

    return location;
  } catch (error: any) {
    throw new Error(`Error fetching location: ${error.message}`);
  }
};
interface VendorLocation {
  id: string;
  location: number[];
}

interface GetVendorsParams {
  role: UserRole;
}
const getVendors = async ({ role }: GetVendorsParams): Promise<VendorLocation[]> => {
  const session = await authCache();
  try {
    const users = await prisma.user.findMany({
      where: {
        role: role,
        NOT: session?.user?.email ? { email: session.user.email } : {},
      },
      include: {
        locations: {
          where: { isDefault: true },
          select: {
            coordinates: true,
          },
          take: 1,
        },
      },
    });

    const filteredUsers = users
      .filter((user): user is typeof user & { locations: [{ coordinates: number[] }] } =>
        user.locations.length > 0 && 
        Array.isArray(user.locations[0].coordinates) &&
        user.locations[0].coordinates.length === 2
      )
      .map((user) => ({
        id: user.id,
        location: user.locations[0].coordinates,
      }));

    return filteredUsers;
  } catch (error) {
    console.error("Error fetching vendors:", error);
    return [];
  }
};

export default getVendors;

const getUsers = async () => {
  const session = await authCache();
  if (!session?.user?.email) {
    return [];
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        NOT: {
          email: session.user.email,
        },
      },
    });

    return users;
  } catch (error: any) {
    return [];
  }
};

const getUserWithBuyOrders = async (params: Params) => {
  try {
    const { userId } = params;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        buyerOrders: {
          select: {
            id: true,
            userId: true,
            listingIds: true,
            sellerId: true,
            pickupDate: true,
            quantity: true,
            totalPrice: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            conversationId: true,
            fee: true,
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
};
const getUserWithSellOrders = async (params: Params) => {
  try {
    const { userId } = params;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        sellerOrders: {
          select: {
            id: true,
            userId: true,
            listingIds: true,
            sellerId: true,
            pickupDate: true,
            quantity: true,
            totalPrice: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            conversationId: true,
            fee: true,
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
};

const getUserWithOrders = async ({ userId }: { userId?: string }) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        buyerOrders: {
          select: {
            id: true,
            userId: true,
            listingIds: true,
            sellerId: true,
            pickupDate: true,
            quantity: true,
            totalPrice: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            conversationId: true,
            fee: true,
          },
        },
        sellerOrders: {
          select: {
            id: true,
            userId: true,
            listingIds: true,
            sellerId: true,
            pickupDate: true,
            quantity: true,
            totalPrice: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            conversationId: true,
            fee: true,
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
};

interface User {
  id: string;
  name: string;
  firstName: string | null;
  image: string | null;
  url: string | null;
  createdAt: Date;
}
interface User1 {
  id: string;
  name: string;
  firstName: string | null;
  image: string | null;
  createdAt: Date;
}

interface Review {
  id: string;
  reviewerId: string;
  reviewedId: string;
  buyer: boolean;
  review: string;
  rating: number;
}

type ReviewerData = Pick<User, "id" | "name" | "firstName" | "image" | "url">;

export type ReviewWithReviewer = Review & {
  reviewer: ReviewerData | null;
};

const getUserWithBuyReviews = async (
  params: Params
): Promise<{
  user: User;
  reviews: ReviewWithReviewer[];
} | null> => {
  try {
    const { userId } = params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        firstName: true,
        image: true,
        url: true,
        createdAt: true,
      },
    });

    const reviews = await prisma.reviews.findMany({
      where: {
        reviewedId: userId,
        buyer: false,
      },
    });

    const reviewsWithReviewer = await Promise.all(
      reviews.map(async (review) => {
        const reviewer = await prisma.user.findUnique({
          where: { id: review.reviewerId },
          select: {
            id: true,
            name: true,
            firstName: true,
            image: true,
            url: true,
          },
        });
        return { ...review, reviewer };
      })
    );

    if (!user) {
      return null;
    }

    return { user, reviews: reviewsWithReviewer };
  } catch (error: any) {
    throw new Error(error);
  }
};
const getUserById = async (params: Params) => {
  try {
    const { userId } = params;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return null;
    }
    return user;
  } catch (error: any) {
    throw new Error(error);
  }
};
interface FavCardUser {
  url: string | null;
  image: string | null;
  name: string;
  id: string;
  location: {
    type: string;
    coordinates: number[];
    address: string[];
    role: string;
  } | null;
}

const getFavCardUser = async (params: Params): Promise<FavCardUser | null> => {
  try {
    const { userId } = params;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        url: true,
        image: true,
        name: true,
        id: true,
        locations: {
          where: { isDefault: true },
          select: {
            type: true,
            coordinates: true,
            address: true,
            role: true,
          },
          take: 1,
        },
      },
    });

    if (!user) {
      return null;
    }

    return {
      ...user,
      location: user.locations[0] || null,
    };
  } catch (error) {
    console.error("Error fetching favorite card user:", error);
    throw new Error(error instanceof Error ? error.message : 'Unknown error occurred');
  }
};

// this gets the coop or producer on /store/[storeId] with their listings
// interface Listing {
//   id: string;
//   title: string;
//   price: number;
//   minOrder: number | null;
//   imageSrc: string[];
//   quantityType: string;
// }
interface Listing1 {
  id: string;
  title: string;
  price: number;
  minOrder: number | null;
  imageSrc: string[];
  quantityType: string;
  rating: number[];
  location: number;
}
export type FinalListingShop = {
  id: string;
  title: string;
  price: number;
  stock: number;
  rating: number[];
  quantityType: string | null;
  createdAt: string;
  location: Location;
  imageSrc: string[];
  subCategory: string;
  minOrder: number | null;
  user: {
    id: string;
    name: string;
    role: UserRole;
  };
};

export type StoreData = {
  user: User1 & {
    listings: FinalListingShop[];
  };
  reviews: ReviewWithReviewer[];
};
interface GetUserLocationParams {
  userId: string;
  index: number;
}
const getUserLocations = async ({ userId }:{userId:string}): Promise<Location[] | null> => {
  try {
    const locations = await prisma.location.findMany({
      where: {
        userId: userId,
      },
      include:{
        user:true,
      }
    });

    return locations;
  } catch (error) {
    console.error("Error fetching user location:", error);
    throw new Error(error instanceof Error ? error.message : 'Unknown error occurred');
  }
};
const getUserLocation = async ({ userId, index }: GetUserLocationParams): Promise<Location | null> => {
  try {
    const location = await prisma.location.findFirst({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'asc',
      },
      skip: index,
      take: 1,
    });

    return location;
  } catch (error) {
    console.error("Error fetching user location:", error);
    throw new Error(error instanceof Error ? error.message : 'Unknown error occurred');
  }
};
function filterListingsByLocation(listings: FinalListingShop[]) {
  return listings.filter((listing: FinalListingShop) => {
    return listing.location !== undefined && listing.location !== null;
  });
}
// function filternullhours(listings: FinalListingShop[]) {
//   return listings.filter(
//     (listing: FinalListingShop) =>
//       listing.location.hours !== undefined &&
//       listing.location.hours !== null &&
//       listing.location.hours !== "null"
//   );
// }


// Update the getUserStore function
const getUserStore = async (
  params: IStoreParams
): Promise<StoreData | null> => {
  try {
    const { url } = params;
    const user = await prisma.user.findFirst({
      where: {
        url: {
          equals: url,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        name: true,
        firstName: true,
        image: true,
        bio: true,
        createdAt: true,
        role: true,
        listings: {
          select: {
            imageSrc: true,
            title: true,
            price: true,
            minOrder: true,
            rating: true,
            id: true,
            quantityType: true,
            location: true,
            stock: true,
            subCategory: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    const reviews = await prisma.reviews.findMany({
      where: {
        reviewedId: user.id,
        buyer: true,
      },
    });

    const reviewsWithReviewer = await Promise.all(
      reviews.map(async (review) => {
        const reviewer = await prisma.user.findUnique({
          where: { id: review.reviewerId },
          select: {
            id: true,
            name: true,
            firstName: true,
            image: true,
            url: true,
          },
        });
        return { ...review, reviewer };
      })
    );

    const safeListings = await Promise.all(user.listings.map(async (listing) => {
      const location = await getUserLocation({
        userId: user.id,
        index: listing.location
      });
      return {
        ...listing,
        location,
        quantityType: listing.quantityType || '', // Provide default empty string if null
        minOrder: listing.minOrder || 0, // Provide default 0 if null
        createdAt: listing.createdAt.toISOString(), // Convert Date to string
        user: {
          id: user.id,
          name: user.name,
          role: user.role,
        },
      } as FinalListingShop; // Type assertion to FinalListingShop
    }));

    let resolvedSafeListings = safeListings.filter(listing => 
      listing.location !== null && 
      listing.location.hours !== undefined && 
      listing.location.hours !== null
    );

    return {
      user: { ...user, listings: resolvedSafeListings },
      reviews: reviewsWithReviewer,
    };
  } catch (error: any) {
    throw new Error(error);
  }
};

const getUserwithCart = async () => {
  const session = await authCache();
  if (session?.user) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: session?.user?.id,
        },
        include: { cart: true },
      });

      if (!user) {
        return null;
      }
      return user;
    } catch (error: any) {
      throw new Error(error);
    }
  }
};

export interface NavUser {
  id: string;
  firstName: string | null;
  url: string | null;
  role: UserRole;
  name: string;
  email: string;
  image: string | null;
  cart: Cart[];
  locations: Location[];
  stripeAccountId: string | null;
  hasPickedRole: boolean | null;
  buyerOrders: {
    id: string;
    conversationId: string | null;
    status: number;
    updatedAt: Date;
    seller: { name: string; } | null; 
  }[];
  sellerOrders: {
    id: string;
    conversationId: string | null;
    status: number;
    updatedAt: Date;
    buyer: { name: string; } | null; 
  }[];
}

const getNavUser = async (): Promise<NavUser | null> => {
  const session = await authCache();
  const User = session?.user;
  if (!User) {
    return null;
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: User.id,
      },
      select: {
        id: true,
        firstName: true,
        hasPickedRole: true,
        role: true,
        name: true,
        url: true,
        email: true,
        image: true,
        cart: {
          select: {
            id: true,
            quantity: true,
            listingId: true,
          },
        },
        locations: true, 
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
        stripeAccountId: true,
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

    let updatedCart = user.cart;
    if (user.cart && user.cart.length > 0) {
      const cartItemsPromises = user.cart.map(async (cartItem) => {
        try {
          const listing = await prisma.listing.findUnique({
            where: { id: cartItem.listingId },
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
          });
          if (!listing) {
            await prisma.cart.delete({
              where: { id: cartItem.id },
            });
            return null;
          }
          return { ...cartItem, listing };
        } catch (error) {
          console.error("Error fetching cart item:", error);
          return null;
        }
      });

      updatedCart = (await Promise.all(cartItemsPromises)).filter(item => item !== null);
    }

    const navUser: NavUser = {
      ...user,
      cart: updatedCart as Cart[],
    };

    return navUser;
  } catch (error) {
    console.error("Error in getNavUser:", error);
    throw new Error(error instanceof Error ? error.message : 'Unknown error occurred');
  }
};

const getRoleGate = async () => {
  const session = await authCache();
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: session?.user?.id,
      },
      select: {
        role: true,
      },
    });

    if (user) {
      return user;
    }
    return null;
  } catch (error: any) {
    throw new Error(error);
  }
};
const getRole = async (params: Params) => {
  const { userId } = params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        role: true,
      },
    });

    if (user) {
      return user;
    }
    return null;
  } catch (error: any) {
    throw new Error(error);
  }
};

export {
  getFavCardUser,
  getVendors,
  getUsers,
  getUserWithSellOrders,
  getUserWithOrders,
  getUserWithBuyReviews,
  getUserById,
  getUserStore,
  getUserWithBuyOrders,
  getUserwithCart,
  getNavUser,
  getRoleGate,
  getRole,
  getLocationByIndex,
  getUserLocations
};

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
    minOrder: number | null;
    rating: number[];
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
interface Cart {
  id: string;
  quantity: number;
  listingId: string;
  listing: {
    imageSrc: string[];
    quantityType: string;
    title: string;
    user: {
      id: string;
      name: string;
    };
  };
}

