//action to get listings based on search params in the market pages.
import prisma from "@/lib/prismadb";
import { Location, UserRole } from "@prisma/client";
import axios from "axios";

export type FinalListing = {
  id: string;
  title: string;
  price: number;
  stock: number;
  rating: number[];
  reports: number | null;
  SODT: number | null;
  quantityType: string | null;
  shelfLife: number;
  harvestFeatures: boolean | null;
  projectedStock: number | null;
  harvestDates: string[];
  createdAt: Date;
  location: Location | null;
  keyWords: string[];
  imageSrc: string[];
  userId: string;
  subCategory: string;
  minOrder: number | null;
  review: boolean | null;
  user: {
    id: string;
    name: string;
    role: UserRole;
  };
};

export type FinalListing1 = {
  id: string;
  title: string;
  price: number;
  stock: number;
  rating: number[];
  quantityType: string | null;
  createdAt: Date;
  location: {
    id: string;
    userId: string;
    displayName: string | null;
    type: string;
    coordinates: number[];
    address: string[];
    role: UserRole;
    isDefault: boolean;
    showPreciseLocation: boolean;
    createdAt: Date;
    updatedAt: Date;
    hours: {
      delivery: ({
        date: Date;
        capacity: number | null;
      } & {
        timeSlots: {
          open: number;
          close: number;
        }[];
      })[];
      pickup: ({
        date: Date;
        capacity: number | null;
      } & {
        timeSlots: {
          open: number;
          close: number;
        }[];
      })[];
    } | null;
  } | null;
  keyWords: string[];
  imageSrc: string[];
  subCategory: string;
  minOrder: number | null;
  review: boolean | null;
  user: {
    id: string;
    name: string;
    role: UserRole;
  };
};
interface IParams {
  listingId?: string;
}
const getListingByIdUpdate = async (params: IParams) => {
  try {
    const { listingId } = params;

    const listing = await prisma.listing.findUnique({
      where: {
        id: listingId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            createdAt: true,
            updatedAt: true,
            emailVerified: true,
            role: true,
            url: true,
            locations: true,
          },
        },
        location: true,
      },
    });

    if (!listing) {
      return null;
    }

    return {
      ...listing,
      createdAt: listing.createdAt.toString(),
      user: {
        ...listing.user,
        createdAt: listing.user.createdAt.toString(),
        updatedAt: listing.user.updatedAt.toString(),
        emailVerified: listing.user.emailVerified?.toString() || null,
      },
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  }
};
export async function getListingsByIdsChat(listingIds: string[]) {
  try {
    const listings = await prisma.listing.findMany({
      where: {
        id: {
          in: listingIds,
        },
      },
      select: {
        id: true,
        title: true,
        price: true,
        imageSrc: true,
        quantityType: true,
      },
      orderBy: {
        price: "asc",
      },
    });

    const orderedListings = listingIds
      .map((id) => listings.find((listing) => listing.id === id))
      .filter(Boolean);

    return orderedListings;
  } catch (error) {
    console.error("Error fetching listings:", error);
    return [];
  }
}

// get an array of listings from an array of listing ids
const GetListingsByIds = async (params: Params) => {
  try {
    const { listingIds } = params;
    let listings = await prisma.listing.findMany({
      where: {
        id: {
          in: listingIds,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            createdAt: true,
            updatedAt: true,
            emailVerified: true,
            role: true,
            url: true,
          },
        },
        location: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    // const safeListings = listings.map(async (listing) => {
    //   const location = (await getUserLocation(listing)) as unknown as Location;
    //   const Listing: FinalListing = listing as unknown as FinalListing;
    //   Listing.location = location;
    //   return {
    //     ...Listing,
    //     createdAt: listing.createdAt.toISOString(),
    //   };
    // });
    // let resolvedSafeListings = await Promise.all(safeListings);
    // resolvedSafeListings = await Promise.all(
    //   filterListingsByLocation(resolvedSafeListings)
    // );
    // resolvedSafeListings = await Promise.all(
    //   filternullhours(resolvedSafeListings)
    // );
    return { listings: listings };
  } catch (error: any) {
    throw new Error(error);
  }
};

// get a single listing by id
export async function getUnique(params: { id?: string }) {
  try {
    const { id } = params;

    if (!id) return null;

    const listing = await prisma.listing.findUnique({
      where: {
        id: id,
      },

      select: {
        title: true,
        id: true,
        description: true,
        imageSrc: true,
        shelfLife: true,
        stock: true,
        createdAt: true,
        quantityType: true,
        price: true,
        rating: true,
        minOrder: true,
        user: {
          select: {
            id: true,
            name: true,
            createdAt: true,
            updatedAt: true,
            emailVerified: true,
            role: true,
            url: true,
          },
        },
        location: {
          select: { id: true, hours: true, address: true, coordinates: true },
        },
      },
    });

    if (!listing) {
      return null;
    }

    // Ensure dates are serializable
    return JSON.parse(JSON.stringify(listing));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
    } else {
      console.error("Error fetching listing:", error);
    }
    return null;
  }
}
export async function getListingStockById(params: { listingId?: string }) {
  try {
    const { listingId } = params;

    if (!listingId) return null;

    const listing = await prisma.listing.findUnique({
      where: {
        id: listingId,
      },
      select: {
        stock: true,
        quantityType: true,
        title: true,
      },
    });

    if (!listing) {
      return null;
    }

    // Ensure dates are serializable
    return JSON.parse(JSON.stringify(listing));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
    } else {
      console.error("Error fetching listing:", error);
    }
    return null;
  }
}
export async function getListingByIdMetaData(params: { listingId?: string }) {
  try {
    const { listingId } = params;

    if (!listingId) return null;

    const listing = await prisma.listing.findUnique({
      where: {
        id: listingId,
      },
      select: {
        title: true,
        description: true,
      },
    });

    if (!listing) {
      return null;
    }

    // Ensure dates are serializable
    return JSON.parse(JSON.stringify(listing));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
    } else {
      console.error("Error fetching listing:", error);
    }
    return null;
  }
}

const GetListingsByUserId = async (params: IListingsOrderParams) => {
  try {
    const { userId } = params;

    let query: any = {};

    if (userId) {
      query.userId = userId;
    }
    let listings = await prisma.listing.findMany({
      where: query,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: { select: { id: true, name: true, role: true } },
        location: true,
      },
    });
    // const safeListings = listings.map(async (listing: any) => {
    //   const location = (await getUserLocation2(listing)) as unknown as Location;
    //   const Listing = listing as unknown as FinalListing;
    //   return {
    //     ...Listing,
    //     location,
    //     createdAt: listing.createdAt.toISOString(),
    //   };
    // });
    // let resolvedSafeListings = await Promise.all(safeListings);

    return { listings: listings };
  } catch (error: any) {
    throw new Error(error);
  }
};
export interface IListingsOrderParams {
  userId?: string;
}

const GetListingsByOrderId = async (params: IListingsOrderParams) => {
  try {
    const { userId } = params;

    let query: any = {};

    if (userId) {
      query.userId = userId;
    }

    let listings = await prisma.listing.findMany({
      where: query,
      orderBy: {
        createdAt: "desc",
      },
      include: { user: { select: { id: true } }, location: true },
    });

    return { listings: listings };
  } catch (error: any) {
    throw new Error(error);
  }
};

export {
  GetListingsByIds,
  GetListingsByOrderId,
  GetListingsByUserId,
  getListingByIdUpdate,
};

export interface IListingsParams {
  lat?: string;
  lng?: string;
  q?: string;
  ra?: string;
  radius?: string;
  pm?: string;
  c?: string;
  p?: string;
  s?: string;
  pr?: string;
  cat?: string;
  subcat?: string;
}
export interface Params {
  listingIds: string[];
}
