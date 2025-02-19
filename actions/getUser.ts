import prisma from "@/lib/prismadb";
import { OrderStatus, UserRole } from "@prisma/client";
import authCache from "@/auth-cache";
import { Location } from "@prisma/client";

interface Params {
  userId?: string;
}
interface IStoreParams {
  url?: string;
}
interface IStoreLocationParams {
  id?: string;
}

interface VendorLocation {
  id: string;
  coordinates: number[];
}

interface GetVendorsParams {
  role: UserRole;
}
const getVendorLocsMap = async ({
  role,
}: GetVendorsParams): Promise<VendorLocation[]> => {
  const session = await authCache();
  try {
    const vendorLocs = await prisma.location.findMany({
      where: {
        role: role,
      },
      select: {
        id: true,
        coordinates: true,
      },
    });
    return vendorLocs;
  } catch (error) {
    console.error("Error fetching vendors:", error);
    return [];
  }
};

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
            // listingIds: true,
            sellerId: true,
            pickupDate: true,
            items: true,
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
            sellerId: true,
            pickupDate: true,
            items: true,
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
            // listingIds: true,
            sellerId: true,
            items: true,
            pickupDate: true,
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
            // listingIds: true,
            sellerId: true,
            pickupDate: true,
            items: true,
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

    return user;
  } catch (error: any) {
    throw new Error(error);
  }
};

interface User {
  id: string;
  name: string;
  fullName: { first: string | null } | null;
  image: string | null;
  url: string | null;
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

type ReviewerData = Pick<User, "id" | "name" | "fullName" | "image" | "url">;

export type ReviewWithReviewer = Review & {
  reviewer: ReviewerData | null;
};

const getUserWithBuyReviews = async (
  params: Params
): Promise<{
  user: User;
  reviews: any;
} | null> => {
  try {
    const { userId } = params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        fullName: {
          select: { first: true },
        },
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
            fullName: {
              select: {
                first: true,
              },
            },
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
    throw new Error(
      error instanceof Error ? error.message : "Unknown error occurred"
    );
  }
};

export interface BasketLocation {
  id: string;
  coordinates: number[] | null;
  address: string[] | null;
  role: UserRole;
  user: {
    id: string;
  };
}
const getUserLocationsBasket = async (): Promise<BasketLocation[] | null> => {
  const session = await authCache();
  try {
    const locations = await prisma.location.findMany({
      where: {
        userId: session?.user?.id,
      },
      select: {
        id: true,
        coordinates: true,
        address: true,
        role: true,
        user: {
          select: {
            id: true,
          },
        },
      },
    });

    return locations;
  } catch (error) {
    console.error("Error fetching user location:", error);
    throw new Error(
      error instanceof Error ? error.message : "Unknown error occurred"
    );
  }
};

// Update the getUserStore function
const getUserStore = async (params: IStoreParams): Promise<any | null> => {
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
        fullName: {
          select: {
            first: true,
          },
        },
        image: true,
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
            location: {
              select: {
                address: true,
              },
            },
            stock: true,
            subCategory: true,
          },
        },
        locations: {
          select: {
            id: true,
            displayName: true,
            address: true,
          },
        },
      },
    });

    const reviews = await prisma.reviews.findMany({
      where: {
        reviewedId: user?.id,
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
            fullName: {
              select: {
                first: true,
              },
            },
            image: true,
            url: true,
          },
        });
        return { ...review, reviewer };
      })
    );

    return {
      user: user,
      reviews: reviewsWithReviewer,
    };
  } catch (error: any) {
    throw new Error(error);
  }
};

const GetStoreByLocation = async (params: IStoreLocationParams) => {
  try {
    const { id } = params;
    const listings = await prisma.listing.findMany({
      where: {
        locationId: id,
      },
      include: {
        user: true,
        location: true,
      },
    });
    if (listings.length === 0) {
      return { listings: [], user: null, location: null };
    }
    const { user, location } = listings[0];

    return {
      listings: listings.map((listing) => {
        const { user, location, ...listingData } = listing;
        return listingData;
      }),
      user,
      location,
    };
  } catch (error) {
    console.error(error);
  }
};

const getCurrentUser = async () => {
  const session = await authCache();
  if (session?.user) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: session?.user?.id,
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
};

export interface NavUser {
  id: string;
  fullName: { first: string | null } | null;
  url: string | null;
  role: UserRole;
  name: string;
  email: string;
  image: string | null;
  // cart: CartItem[];
  locations: Location[];
  stripeAccountId: string | null;
  hasPickedRole: boolean | null;
  buyerOrders: {
    id: string;
    conversationId: string | null;
    status: OrderStatus;
    updatedAt: Date;
    seller: { name: string } | null;
    buyer: { name: string } | null;
  }[];
  sellerOrders: {
    id: string;
    conversationId: string | null;
    status: OrderStatus;
    updatedAt: Date;
    buyer: { name: string } | null;
    seller: { name: string } | null;
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
        fullName: {
          select: {
            first: true,
          },
        },
        hasPickedRole: true,
        role: true,
        name: true,
        url: true,
        email: true,
        image: true,
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
            buyer: {
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
            seller: {
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

    const navUser: NavUser = {
      ...user,
    };

    return navUser;
  } catch (error) {
    console.error("Error in getNavUser:", error);
    throw new Error(
      error instanceof Error ? error.message : "Unknown error occurred"
    );
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
  getVendorLocsMap,
  getUsers,
  getUserWithSellOrders,
  getUserWithOrders,
  getUserWithBuyReviews,
  getUserById,
  getUserStore,
  getUserWithBuyOrders,
  getCurrentUser,
  getNavUser,
  getRoleGate,
  getUserLocationsBasket,
  getRole,
  GetStoreByLocation,
};
