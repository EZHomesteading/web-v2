import prisma from "@/app/libs/prismadb";

interface ILocation {
  type: "Point";
  coordinates: [number, number]; // Assuming [longitude, latitude]
}

export interface IListingsParams {
  userId?: string; // Optional parameter: userId
  location?: ILocation;
  category?: string;
  subCategory?: string; // Optional parameter: category
}

// Function to retrieve listings based on provided parameters
export default async function getListings(
  params: IListingsParams // Accepting parameters of type IListingsParams
) {
  try {
    // Destructuring parameters
    const { userId, location, category, subCategory } = params;

    // Initializing an empty query object
    let query: any = {};

    // Adding conditions to the query based on provided parameters

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
