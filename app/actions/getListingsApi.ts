import prisma from "@/app/libs/prismadb";
import haversine from "haversine-distance";
import Fuse from "fuse.js";

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
  r?: string;
  description?: string;
}

export default async function getListings(params: IListingsParams) {
  try {
    const { lat, lng, r, q } = params;

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

    if (lat && lng && r) {
      const userLocation = {
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
      };
      const radiusKm = parseFloat(r);

      listings = listings.filter((listing) => {
        const listingLocation = listing.location as unknown as {
          coordinates: [number, number];
        };
        const listingCoordinates = {
          latitude: listingLocation.coordinates[1],
          longitude: listingLocation.coordinates[0],
        };

        const distance = haversine(listingCoordinates, userLocation);
        return distance <= radiusKm;
      });
    }

    if (q) {
      const fuseOptions = {
        keys: ["user.name", "title", "category", "subCategory", "description"],
        threshold: 0.3,
      };
      const fuse = new Fuse(listings, fuseOptions);
      const results = fuse.search(q);
      listings = results.map((result) => result.item);
    }

    const safeListings = listings.map((listing) => ({
      ...listing,
      createdAt: listing.createdAt.toISOString(),
    }));

    return safeListings;
  } catch (error: any) {
    throw new Error(error);
  }
}
