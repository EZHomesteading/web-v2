import prisma from "@/lib/prismadb";
import { UserRole } from "@prisma/client";
import authCache from "@/auth-cache";
import { ExtendedHours } from "@/next-auth";

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
        name: true,
        firstName: true,
        image: true,
        url: true,
        location: {
          select: {
            coordinates: true,
          },
        },
        listings: {
          select: {
            imageSrc: true,
          },
        },
      },
    });
    return users;
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
        buyerOrders: true,
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
        sellerOrders: true,
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
        buyerOrders: true,
        sellerOrders: true,
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

const getUserWithBuyReviews = async (params: Params) => {
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
        buyerReviews: {
          select: {
            id: true,
            review: true,
            rating: true,
            seller: {
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
const getUserStore = async (params: IStoreParams) => {
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
        hours: true,
        listings: {
          select: {
            imageSrc: true,
            title: true,
            price: true,
            minOrder: true,
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
