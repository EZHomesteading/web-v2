import prisma from "@/lib/prismadb";
import { Reviews, UserRole } from "@prisma/client";
import authCache from "@/auth-cache";
import { ExtendedHours } from "@/next-auth";
import { JsonValue } from "@prisma/client/runtime/library";
import { Location } from "./getListings";

interface p {
  role: UserRole;
}

interface Params {
  userId?: string;
}
interface IStoreParams {
  url?: string;
}

const getVendors = async ({ role }: p) => {
  const session = await authCache();
  try {
    const users = await prisma.user.findMany({
      where: {
        role: role,
        NOT: session?.user?.email ? { email: session.user.email } : {},
      },
      select: {
        id: true,
        location: {
          select: {
            0: {
              select: {
                coordinates: true,
              },
            },
          },
        },
      },
    });
    const filteredUsers = users
      .filter(
        (
          user
        ): user is { id: string; location: { 0: { coordinates: number[] } } } =>
          user.location !== null &&
          user.location[0] !== null &&
          user.location[0].coordinates !== null &&
          Array.isArray(user.location[0].coordinates)
      )
      .map((user) => ({
        id: user.id,
        location: user.location[0].coordinates,
      }));
    return filteredUsers;
  } catch (error: any) {
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
const getFavCardUser = async (params: Params) => {
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
        location: true,
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
const getUserLocation2 = async (listing: Listing1, id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        location: { select: { [listing.location]: true } },
      },
    });

    if (!user) {
      return null;
    }
    if (!user.location) {
      return null;
    }
    return user.location[listing.location];
  } catch (error: any) {
    throw new Error(error);
  }
};
function filterListingsByLocation(listings: FinalListingShop[]) {
  return listings.filter((listing: FinalListingShop) => {
    return listing.location !== undefined || listing.location !== null;
  });
}
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
    const safeListings = user.listings.map(async (listing) => {
      const location = (await getUserLocation2(
        listing,
        user.id
      )) as unknown as Location;
      const Listing = listing as unknown as FinalListingShop;
      return {
        ...Listing,
        location,
      };
    });
    let resolvedSafeListings = await Promise.all(safeListings);
    resolvedSafeListings = await Promise.all(
      filterListingsByLocation(resolvedSafeListings)
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

const getNavUser = async () => {
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
        // cart: {
        //   where: {
        //     listing: {
        //       id: {
        //         startsWith: "6",
        //       },
        //     },
        //   },
        //   select: {
        //     id: true,
        //     quantity: true,
        //     listing: {
        //       select: {
        //         imageSrc: true,
        //         quantityType: true,
        //         title: true,
        //         user: {
        //           select: {
        //             id: true,
        //             name: true,
        //           },
        //         },
        //       },
        //     },
        //   },
        // },
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

    return user;
  } catch (error: any) {
    throw new Error(error);
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
