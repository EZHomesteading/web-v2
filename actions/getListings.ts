//action to get listings based on search params in the market pages.
import prisma from "@/lib/prismadb";
import haversine from "haversine-distance";
import Fuse from "fuse.js";
import { Location, UserRole } from "@prisma/client";
import { currentUser } from "@/lib/auth";
import { getDisplayName } from "next/dist/shared/lib/utils";

// Interface for defining the search parameters
type sort = "htl" | "lth" | "1" | "2" | "3" | "4" | "5";

// Main function to fetch listings based on search parameters

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
    SODT: number | null;
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
  location: Location | null;
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

// Main function to fetch listings based on search parameters
const GetListingsMarket = async (
  params: IListingsParams,
  page: number,
  perPage: number
) => {
  const user = await currentUser();
  try {
    const { lat, lng, radius, q, pm, c, p, s, ra, pr, cat, subcat } = params;

    let query: any = {};
    if (subcat) {
      query.subCategory = subcat;
    }
    if (cat) {
      query.category = cat;
    }
    query.location = { isNot: null };

    let listings: FinalListing1[] = [];
    const listingSelect = {
      id: true,
      title: true,
      quantityType: true,
      subCategory: true,
      category: true,
      price: true,
      keyWords: true,
      imageSrc: true,
      minOrder: true,
      createdAt: true,
      rating: true,
      stock: true,
      description: true,
      location: {
        select: {
          id: true,
          userId: true,
          type: true,
          coordinates: true,
          displayName: true,
          showPreciseLocation: true,
          address: true,
          role: true,
          isDefault: true,
          createdAt: true,
          updatedAt: true,
          hours: true,
        },
      },
      review: true,
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
      console.log("entered case 1");
      listings = await prisma.listing.findMany({
        where: {
          user: {
            role: UserRole.COOP,
          },
          ...query,
          stock: s === "f" ? { lt: 1 } : { gt: 0 }, // Filter by stock availability
        },
        select: listingSelect,
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
        console.log("entered case 2");
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
        console.log("entered case 3");
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
        console.log("entered case 4");
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
        console.log("entered case 5");
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

    let Listings: FinalListing1[] = listings as unknown as FinalListing1[];
    // Shuffle the listings
    function shuffle(array: any) {
      let currentIndex = array.length;
      while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex],
          array[currentIndex],
        ];
      }
    }
    shuffle(Listings);

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
        includeScore: true,
        keys: [
          "user.name",
          "title",
          "category",
          "subCategory",
          "description",
          "keyWords",
        ],
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
      function showOnlyNumber(arr: FinalListing1[], targetLength: number) {
        const filteredArr = arr.filter(
          (item) => item.rating.length === targetLength
        );
        return filteredArr;
      }

      if (sort === "htl") {
        Listings = sortByArrayLength(Listings, false);
      }
      if (sort === "lth") {
        Listings = sortByArrayLength(Listings);
      }
      if (sort === "1") {
        Listings = showOnlyNumber(Listings, 1);
      }
      if (sort === "2") {
        Listings = showOnlyNumber(Listings, 2);
      }
      if (sort === "3") {
        Listings = showOnlyNumber(Listings, 3);
      }
      if (sort === "4") {
        Listings = showOnlyNumber(Listings, 4);
      }
      if (sort === "5") {
        Listings = showOnlyNumber(Listings, 5);
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
        createdAt: Listing.createdAt.toISOString(),
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
// const getListingSlug = async (params:IParams) => {
//   try {
//     const { listingId } = params;
//     if (listingId?.length !== 24) {
//       return null;
//     }
//     const listing = await prisma.listing.findUnique({
//       where: {
//         id: listingId,
//       },
//       include: {
//         user: {
//           select: {
//             id: true,
//             name: true,
//             createdAt: true,
//             updatedAt: true,
//             emailVerified: true,
//             role: true,
//             url: true,
//             SODT: true,
//           },
//         },
//         location: true,
//       },
//     });

//     if (!listing) {
//       return null;
//     }
//     return listing;
//   } catch (error: any) {
//     console.error(error);
//     throw new Error(error);
//   }
// }
// get a single listing by id
const getListingById = async (params: IParams) => {
  try {
    const { listingId } = params;
    if (listingId?.length !== 24) {
      return null;
    }
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
        location: true,
      },
    });

    if (!listing) {
      return null;
    }
    return listing;
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
        user: { select: { id: true, name: true, SODT: true, role: true } },
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

    // const safeListings = listings.map(async (listing: any) => {
    //   const location = (await getUserLocation2(listing)) as unknown as Location;
    //   const Listing: FinalListing = listing as unknown as FinalListing;
    //   return {
    //     ...Listing,
    //     location,
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
  cat?: string;
  subcat?: string;
}
export interface Params {
  listingIds: string[];
}
interface IParams {
  listingId?: string;
}
