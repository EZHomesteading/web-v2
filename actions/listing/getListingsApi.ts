import prisma from "@/lib/prismadb";
import haversine from "haversine-distance";
import Fuse from "fuse.js";
import { UserRole } from "@prisma/client";

export interface IListingsParams {
  lat?: string;
  lng?: string;
  q?: string;
  radius?: string;
  pickProduceMyself?: string;
  c?: string;
  p?: string;
}

export default async function GetListings(
  params: IListingsParams,
  page: number,
  perPage: number
) {
  try {
    const { lat, lng, radius, q, pickProduceMyself, c, p } = params;

    let query: any = {};

    if (pickProduceMyself) {
      query.pickProduceMyself = pickProduceMyself === "true";
    }
    let listings;
    if (c === "true" && p === "true") {
      listings = await prisma.listing.findMany({
        where: {
          user: {
            role: {
              in: [UserRole.COOP, UserRole.PRODUCER],
            },
          },
          ...query,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: true,
        },
      });
    } else if (c === "true") {
      console.log("entered case 2");
      listings = await prisma.listing.findMany({
        where: {
          user: {
            role: UserRole.COOP,
          },
          ...query,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: true,
        },
      });
    } else if (p === "true") {
      console.log("entered case 3");
      listings = await prisma.listing.findMany({
        where: {
          user: {
            role: UserRole.PRODUCER,
          },
          ...query,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: true,
        },
      });
    } else {
      console.log("entered case 4");
      listings = await prisma.listing.findMany({
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: true,
        },
      });
    }

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

    if (q) {
      const fuseOptions = {
        keys: ["user.name", "title", "category", "subCategory", "description"],
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
