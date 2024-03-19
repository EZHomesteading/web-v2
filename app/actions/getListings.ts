import prisma from "@/app/libs/prismadb";
import haversine from "haversine-distance";

interface ILocation {
  type: "Point";
  coordinates: [number, number];
}

export interface IListingsParams {
  userId?: string;
  lat?: string;
  lng?: string;
  category?: string;
  location?: ILocation;
  search?: string;
  subCategory?: string;
  radius?: string;
}

export default async function getListings(params: IListingsParams) {
  try {
    const { userId, lat, lng, radius, search, category, subCategory } = params;

    let query: any = {};

    if (userId) {
      query.userId = userId;
    }

    if (search) {
      query.title = search;
    }

    if (subCategory) {
      query.subCategory = subCategory;
    }
    if (category) {
      query.category = category;
    }

    let listings = await prisma.listing.findMany({
      where: query,
      orderBy: {
        createdAt: "desc",
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

    const safeListings = listings.map((listing) => ({
      ...listing,
      createdAt: listing.createdAt.toISOString(),
    }));

    return safeListings;
  } catch (error: any) {
    throw new Error(error);
  }
}
