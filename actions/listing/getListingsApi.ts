import prisma from "@/lib/prismadb";
import haversine from "haversine-distance";
import Fuse from "fuse.js";
import { currentUser } from "@/lib/auth";

interface ILocation {
  type: "Point";
  coordinates: [number, number];
}

export interface IListingsParams {
  lat?: string;
  lng?: string;
  category?: string;
  location?: ILocation;
  q?: string;
  subCategory?: string;
  radius?: string;
  description?: string;
}

export default async function GetListings(
  params: IListingsParams,
  page: number,
  perPage: number
) {
  try {
    const { lat, lng, radius, q } = params;

    let query: any = {};

    let listings = await prisma.listing.findMany({
      where: query,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
      },
    });

    if (lat && lng && radius) {
      const userLocation = {
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
      };

      const radiusInMeters = parseFloat(radius) * 1000;

      listings = listings.filter((listing) => {
        const listingLocation = listing.location as unknown as {
          coordinates: [number, number];
        };
        const listingCoordinates = {
          latitude: listingLocation.coordinates[1],
          longitude: listingLocation.coordinates[0],
        };

        const distance = haversine(listingCoordinates, userLocation);

        return distance <= radiusInMeters;
      });
    }
    const user = await currentUser();
    if (user?.role === "PRODUCER") {
      const fuseOptions = { keys: ["user.role"], threshold: 0.3 };
      const fuse = new Fuse(listings, fuseOptions);
      const results = fuse.search("coop");
      listings = results.map((result) => result.item);
      //remove producer listings from listings array.
    }
    if (user?.role === "CONSUMER") {
      const fuseOptions = { keys: ["user.role"], threshold: 0.3 };
      const fuse = new Fuse(listings, fuseOptions);
      const results = fuse.search("coop");
      listings = results.map((result) => result.item);
      //remove producer listings from listings array.
    }
    if (q) {
      const fuseOptions = {
        keys: [
          "user.name",
          "title",
          "category",
          "subCategory",
          "description",
          "user.role",
        ],
        threshold: 0.3,
      };
      const fuse = new Fuse(listings, fuseOptions);
      const results = fuse.search(q);
      listings = results.map((result) => result.item);
    }

    const totalItems = listings.length;
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedListings = listings.slice(startIndex, endIndex);

    const safeListings = paginatedListings.map((listing) => ({
      ...listing,
      createdAt: listing.createdAt.toISOString(),
    }));

    return { listings: safeListings, totalItems };
  } catch (error: any) {
    throw new Error(error);
  }
}
