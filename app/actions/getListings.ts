import prisma from "@/app/libs/prismadb";

interface ILocation {
  type: "Point";
  coordinates: [number, number];
}

export interface IListingsParams {
  userId?: string;
  location?: ILocation;
  category?: string;
  subCategory?: string;
}

export default async function getListings(params: IListingsParams) {
  try {
    const { userId, location, category, subCategory } = params;

    let query: any = {};

    if (userId) {
      query.userId = userId;
    }

    if (category) {
      query.category = category;
    }

    if (subCategory) {
      query.subCategory = subCategory;
    }

    // if (location) {
    //   query.location {

    //   };
    // }

    const listings = await prisma.listing.findMany({
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
