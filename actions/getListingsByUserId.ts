import prisma from "@/lib/prismadb";
import haversine from "haversine-distance";

interface ILocation {
  type: "Point";
  coordinates: [number, number];
}

export interface IListingsParams {
  userId?: string;
}

export default async function getListingsByUserId(params: IListingsParams) {
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
    });

    const safeListings = listings.map((listing) => ({
      ...listing,
      createdAt: listing.createdAt.toISOString(),
    }));

    return safeListings;
  } catch (error: any) {
    throw new Error(error);
  }
}
