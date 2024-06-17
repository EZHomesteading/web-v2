//action to get listings based on search params in the market pages.
import prisma from "@/lib/prismadb";
import haversine from "haversine-distance";
import Fuse from "fuse.js";
import { UserRole } from "@prisma/client";
import { currentUser } from "@/lib/auth";

// Interface for defining the search parameters

// Main function to fetch listings based on search parameters
const GetListingsMarket = async (
  params: IListingsParams,
  page: number,
  perPage: number
) => {
  const user = await currentUser();
  try {
    const { lat, lng, radius, q, pm, c, p, s } = params;

    let query: any = {};

    let listings: any[] = [];
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
        select: {
          id: true,
          title: true,
          quantityType: true,
          price: true,
          imageSrc: true,
          subCategory: true,
          category: true,
          createdAt: true,
          minOrder: true,
          SODT: true,
          stock: true,
          description: true,
          location: true,
          user: {
            select: {
              id: true,
              role: true,
              name: true,
              SODT: true,
              location: true,
            },
          },
        },
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
          select: {
            id: true,
            title: true,
            quantityType: true,
            price: true,
            minOrder: true,
            imageSrc: true,
            createdAt: true,
            subCategory: true,
            category: true,
            stock: true,
            description: true,
            location: true,
            user: {
              select: {
                id: true,
                role: true,
                name: true,
                location: true,
              },
            },
          },
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
          select: {
            id: true,
            title: true,
            quantityType: true,
            price: true,
            category: true,
            subCategory: true,
            imageSrc: true,
            minOrder: true,
            createdAt: true,
            stock: true,
            description: true,
            location: true,
            user: {
              select: {
                id: true,
                role: true,
                name: true,
                location: true,
              },
            },
          },
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
          select: {
            id: true,
            title: true,
            quantityType: true,
            price: true,
            subCategory: true,
            category: true,
            minOrder: true,
            imageSrc: true,
            createdAt: true,
            stock: true,
            description: true,
            location: true,
            user: {
              select: {
                id: true,
                role: true,
                name: true,
                location: true,
              },
            },
          },
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
          select: {
            id: true,
            title: true,
            quantityType: true,
            subCategory: true,
            category: true,
            price: true,
            imageSrc: true,
            minOrder: true,
            createdAt: true,
            stock: true,
            description: true,
            location: true,
            user: {
              select: {
                id: true,
                role: true,
                name: true,
                location: true,
              },
            },
          },
        });
      }
    }
    //console.log(listings);
    listings.map((listing, index) => {
      //console.log(listings[index].location);
      console.log(listing.user);
      // console.log(index);
      listings[index].location =
        listing.user?.location[parseInt(listing.location)];
    });
    //console.log(listings[0]);
    // If location parameters are provided, filter listings by distance
    console.log("afsfasfhere");
    if (lat && lng && radius) {
      const userLocation = {
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
      };

      const radiusInMeters = parseFloat(radius) * 1000;

      const listingsWithDistance = listings.map((listing) => {
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
      listings = sortedListings.map(({ listing }) => listing);
    }

    // If a search query is provided, filter listings by title, description, etc.
    if (q) {
      const fuseOptions = {
        keys: ["user.name", "title", "category", "subCategory", "description"],
        threshold: 0.3,
      };
      const fuse = new Fuse(listings, fuseOptions);
      const results = fuse.search(q);
      listings = results.map((result) => result.item);
    }

    // Paginate the listings
    const totalItems = listings.length;
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedListings = listings.slice(startIndex, endIndex);

    // Convert createdAt dates to ISO strings
    const safeListings = paginatedListings.map((listing) => ({
      ...listing,
      createdAt: listing.createdAt.toISOString(),
    }));

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
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            location: true,
          },
        },
      },
    });
    const safeListings = listings.map((listing) => ({
      ...listing,
      location: listing.user.location[listing.location],
      createdAt: listing.createdAt.toISOString(),
    }));
    console.log(safeListings);
    return safeListings;
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
            location: true,
            createdAt: true,
            updatedAt: true,
            emailVerified: true,
            role: true,
          },
        },
      },
    });

    if (!listing) {
      return null;
    }

    return {
      ...listing,
      location: listing.user.location[listing.location],
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
      include: { user: { select: { location: true } } },
    });
    const safeListings = listings.map((listing) => ({
      ...listing,
      location: listing.user.location[listing.location],
      createdAt: listing.createdAt.toISOString(),
    }));
    return safeListings;
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
      include: { user: { select: { location: true } } },
    });

    const safeListings = listings.map((listing) => ({
      ...listing,
      location: listing.user.location[listing.location],
      createdAt: listing.createdAt.toISOString(),
    }));

    return safeListings;
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
};
export interface IListingsParams {
  lat?: string;
  lng?: string;
  q?: string;
  radius?: string;
  pm?: string;
  c?: string;
  p?: string;
  s?: string;
}
export interface Params {
  listingIds: string[];
}
interface IParams {
  listingId?: string;
}
