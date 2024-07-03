//action to get listings based on search params in the market pages.
import prisma from "@/lib/prismadb";
import haversine from "haversine-distance";
import Fuse from "fuse.js";
import { Prisma, UserRole } from "@prisma/client";
import { currentUser } from "@/lib/auth";
import { Listing } from "./getCart";

// Interface for defining the search parameters
type sort = "htl" | "lth";
type Listing1 = {
  user: {
    id: string;
    name: string;
    role: UserRole;
  };
  id: string;
  rating: number[];
  location: number;
  createdAt: Date;
  price: number;
  title: string;
  subCategory: string;
  stock: number;
  quantityType: string;
  minOrder: number | null;
  imageSrc: string[];
};
type Listing2 = {
  user: {
    id: string;
  };
  id: string;
  location: number;
  rating: number[];
  SODT: number | null;
  createdAt: Date;
  userId: string;
  price: number;
  title: string;
  subCategory: string;
  stock: number;
  quantityType: string;
  minOrder: number | null;
  imageSrc: string[];
  shelfLife: number;
};
export type Location = {
  type: string;
  coordinates: number[];
  address: string[];
  hours: Prisma.JsonValue;
};
export type FinalListing = {
  id: string;
  title: string;
  price: number;
  stock: number;
  rating: number[];
  SODT: number | null;
  quantityType: string | null;
  shelfLife: number;
  createdAt: string;
  location: Location;
  imageSrc: string[];
  userId: string;
  subCategory: string;
  minOrder: number | null;
  user: {
    id: string;
    SODT: number | null;
    name: string;
    role: UserRole;
    //hours: JsonValue;
  };
};
type FinalListing1 = {
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
// Main function to fetch listings based on search parameters
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
const getUserLocation1 = async (listing: Listing1) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: listing.user.id,
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
const getUserLocation2 = async (listing: Listing2) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: listing.user.id,
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
function filterListingsByLocation(listings: FinalListing[]) {
  return listings.filter((listing: FinalListing) => {
    return listing.location !== undefined || listing.location !== null;
  });
}
function filterListingsByLocation1(listings: FinalListing1[]) {
  return listings.filter((listing: FinalListing1) => {
    return listing.location !== undefined || listing.location !== null;
  });
}

const GetListingsMarket = async (
  params: IListingsParams,
  page: number,
  perPage: number
) => {
  const user = await currentUser();
  try {
    const { lat, lng, radius, q, pm, c, p, s, ra, pr } = params;

    let query: any = {};

    let listings: Listing1[] = [];
    const listingSelect = {
      id: true,
      title: true,
      quantityType: true,
      subCategory: true,
      category: true,
      price: true,
      imageSrc: true,
      minOrder: true,
      createdAt: true,
      rating: true,
      stock: true,
      description: true,
      location: true,
      user: {
        select: {
          id: true,
          role: true,
          name: true,
        },
      },
    };
    // Case 1: If the user is a consumer or there are no extra search params
    if (!user || user?.role === UserRole.CONSUMER) {
      // Fetch listings from cooperatives only

      listings = await prisma.listing.findMany({
        where: {
          user: {
            role: UserRole.COOP,
          },
          ...query,
          stock: s === "f" ? { lt: 1 } : { gt: 0 }, // Filter by stock availability
        },
        select: listingSelect,
        //SODT: true,

        orderBy: {
          createdAt: "desc",
        },
      });
    } else if (
      user?.role === UserRole.COOP ||
      user?.role === UserRole.PRODUCER ||
      user?.role === UserRole.ADMIN
    ) {
      // Case 2: If the user is a cooperative, producer, or admin
      if (c === "t" && p === "t") {
        // Fetch listings from coops and producers
        listings = await prisma.listing.findMany({
          where: {
            user: {
              role: {
                in: [UserRole.COOP, UserRole.PRODUCER],
              },
            },
            ...query,
            stock: s === "f" ? { lt: 1 } : { gt: 0 },
          },
          select: listingSelect,
          orderBy: {
            createdAt: "desc",
          },
        });
      } else if (c === "t") {
        // Case 3: Fetch listings from cooperatives only
        listings = await prisma.listing.findMany({
          where: {
            user: {
              role: UserRole.COOP,
            },
            ...query,
            stock: s === "f" ? { lt: 1 } : { gt: 0 },
          },
          select: listingSelect,
          orderBy: {
            createdAt: "desc",
          },
        });
      } else if (p === "t") {
        // Case 4: Fetch listings from producers only
        listings = await prisma.listing.findMany({
          where: {
            user: {
              role: UserRole.PRODUCER,
            },
            ...query,
            stock: s === "f" ? { lt: 1 } : { gt: 0 },
          },
          orderBy: {
            createdAt: "desc",
          },
          select: listingSelect,
        });
      } else {
        // Case 5: Fetch all listings
        listings = await prisma.listing.findMany({
          where: {
            ...query,
            stock: s === "f" ? { lt: 1 } : { gt: 0 },
          },
          orderBy: {
            createdAt: "desc",
          },
          select: listingSelect,
        });
      }
    }

    const listerine = listings.map(async (listing) => {
      const location = (await getUserLocation1(listing)) as unknown as Location;

      return {
        ...listing,
        location,
        createdAt: listing.createdAt.toISOString(),
      };
    });
    let Listings: FinalListing1[] = listings as unknown as FinalListing1[];
    Listings = await Promise.all(listerine);
    Listings = await Promise.all(filterListingsByLocation1(Listings));
    // If location parameters are provided, filter listings by distance
    if (lat && lng && radius) {
      const userLocation = {
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
      };
      const radiusInMeters = parseFloat(radius) * 1000;

      const listingsWithDistance = Listings.map((listing) => {
        const listingLocation = listing.location as unknown as {
          coordinates: [number, number];
        };
        const listingCoordinates = {
          latitude: listingLocation.coordinates[1],
          longitude: listingLocation.coordinates[0],
        };
        const distance = haversine(listingCoordinates, userLocation);
        return {
          listing,
          distance,
        };
      });

      const filteredListings = listingsWithDistance.filter(
        ({ distance }) => distance <= radiusInMeters
      );

      const sortedListings = filteredListings.sort(
        (a, b) => a.distance - b.distance
      );
      Listings = sortedListings.map(({ listing }) => listing);
    }

    // If a search query is provided, filter listings by title, description, etc.
    if (q) {
      const fuseOptions = {
        keys: ["user.name", "title", "category", "subCategory", "description"],
        threshold: 0.3,
      };
      const fuse = new Fuse(Listings, fuseOptions);
      const results = fuse.search(q);
      Listings = results.map((result) => result.item);
    }
    if (ra) {
      const sort = ra as sort;
      function sortByArrayLength(arr: FinalListing1[], ascending = true) {
        return arr.sort((a, b) => {
          let lengthA = a.rating.length;
          let lengthB = b.rating.length;
          return ascending ? lengthA - lengthB : lengthB - lengthA;
        });
      }
      if (sort === "htl") {
        Listings = sortByArrayLength(Listings, false);
      } else {
        Listings = sortByArrayLength(Listings);
      }
    }
    if (pr) {
      const sort = pr as sort;
      function sortByArrayPrice(arr: FinalListing1[], ascending = true) {
        return arr.sort((a, b) => {
          let lengthA = a.price;
          let lengthB = b.price;
          return ascending ? lengthA - lengthB : lengthB - lengthA;
        });
      }
      if (sort === "htl") {
        Listings = sortByArrayPrice(Listings, false);
      } else {
        Listings = sortByArrayPrice(Listings);
      }
    }
    // Paginate the listings
    const totalItems = Listings.length;
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedListings = Listings.slice(startIndex, endIndex);

    // Convert createdAt dates to ISO strings
    const safeListings = paginatedListings.map((Listing) => {
      return {
        ...Listing,
      };
    });
    return { listings: safeListings, totalItems };
  } catch (error: any) {
    throw new Error(error);
  }
};

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
            SODT: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    const safeListings = listings.map(async (listing) => {
      const location = (await getUserLocation(listing)) as unknown as Location;
      const Listing: FinalListing = listing as unknown as FinalListing;
      Listing.location = location;
      return {
        ...Listing,
        createdAt: listing.createdAt.toISOString(),
      };
    });
    let resolvedSafeListings = await Promise.all(safeListings);
    resolvedSafeListings = await Promise.all(
      filterListingsByLocation(resolvedSafeListings)
    );
    return { listings: resolvedSafeListings };
  } catch (error: any) {
    throw new Error(error);
  }
};

// get a single listing by id
const getListingById = async (params: IParams) => {
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
            SODT: true,
          },
        },
      },
    });

    if (!listing) {
      return null;
    }

    const location = (await getUserLocation(listing)) as unknown as Location;
    const Listing: FinalListing = listing as unknown as FinalListing;
    return {
      ...Listing,
      location,
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
// get a single listing by id
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
            SODT: true,
            location: true,
          },
        },
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
      include: { user: { select: { id: true } } },
    });
    const safeListings = listings.map(async (listing) => {
      const location = (await getUserLocation2(listing)) as unknown as Location;
      const Listing = listing as unknown as FinalListing;
      return {
        ...Listing,
        location,
        createdAt: listing.createdAt.toISOString(),
      };
    });
    let resolvedSafeListings = await Promise.all(safeListings);
    resolvedSafeListings = await Promise.all(
      filterListingsByLocation(resolvedSafeListings)
    );
    return { listings: resolvedSafeListings };
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
      include: { user: { select: { id: true } } },
    });

    const safeListings = listings.map(async (listing) => {
      const location = (await getUserLocation2(listing)) as unknown as Location;
      const Listing: FinalListing = listing as unknown as FinalListing;
      return {
        ...Listing,
        location,
        createdAt: listing.createdAt.toISOString(),
      };
    });
    let resolvedSafeListings = await Promise.all(safeListings);
    resolvedSafeListings = await Promise.all(
      filterListingsByLocation(resolvedSafeListings)
    );
    return { listings: resolvedSafeListings };
  } catch (error: any) {
    throw new Error(error);
  }
};

export {
  GetListingsByIds,
  GetListingsMarket,
  getListingById,
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
}
export interface Params {
  listingIds: string[];
}
interface IParams {
  listingId?: string;
}
