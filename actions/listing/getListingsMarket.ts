import prisma from "@/lib/prismadb";
import haversine from "haversine-distance";
import Fuse from "fuse.js";
import { UserRole } from "@prisma/client";
import { currentUser } from "@/lib/auth";

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
// pm = pick produce myself
// c = coops
// p = producers
// s = stock
export default async function GetListings(
  params: IListingsParams,
  page: number,
  perPage: number
) {
  const user = await currentUser();
  try {
    const { lat, lng, radius, q, pm, c, p, s } = params;

    let query: any = {};

    let listings: any[] = [];
    if (!user || user?.role === UserRole.CONSUMER) {
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
          imageSrc: true,
          subCategory: true,
          category: true,
          createdAt: true,
          minOrder: true,
          stock: true,
          description: true,
          location: {
            select: {
              coordinates: true,
              address: true,
            },
          },
          user: {
            select: {
              id: true,
              role: true,
              name: true,
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
      if (c === "t" && p === "t") {
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
            location: {
              select: {
                coordinates: true,
                address: true,
              },
            },
            user: {
              select: {
                id: true,
                role: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });
      } else if (c === "t") {
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
            location: {
              select: {
                coordinates: true,
                address: true,
              },
            },
            user: {
              select: {
                id: true,
                role: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });
      } else if (p === "t") {
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
            minOrder: true,
            imageSrc: true,
            createdAt: true,
            stock: true,
            description: true,
            location: {
              select: {
                coordinates: true,
                address: true,
              },
            },
            user: {
              select: {
                id: true,
                role: true,
                name: true,
              },
            },
          },
        });
      } else {
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
            location: {
              select: {
                coordinates: true,
                address: true,
              },
            },
            user: {
              select: {
                id: true,
                role: true,
                name: true,
              },
            },
          },
        });
      }
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
