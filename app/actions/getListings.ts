// Importing the necessary modules and functions
import prisma from "@/app/libs/prismadb";

// Interface defining the structure of parameters accepted by the function
export interface IListingsParams {
  userId?: string; // Optional parameter: userId
  locationValue?: string; // Optional parameter: locationValue
  category?: string; // Optional parameter: category
}

// Function to retrieve listings based on provided parameters
export default async function getListings(
  params: IListingsParams // Accepting parameters of type IListingsParams
) {
  try {
    // Destructuring parameters
    const { userId, locationValue, category } = params;

    // Initializing an empty query object
    let query: any = {};

    // Adding conditions to the query based on provided parameters

    if (userId) {
      query.userId = userId; // Filtering by userId if provided
    }

    if (category) {
      query.category = category; // Filtering by category if provided
    }

    if (locationValue) {
      query.locationValue = locationValue; // Filtering by locationValue if provided
    }

    // Filtering out listings based on availability within provided dates

    // Finding listings in the database based on the constructed query
    const listings = await prisma.listing.findMany({
      where: query, // Applying the constructed query
      orderBy: {
        createdAt: "desc", // Ordering the results by createdAt field in descending order
      },
    });

    // Mapping over the listings to ensure safe handling of data
    const safeListings = listings.map((listing) => ({
      ...listing,
      createdAt: listing.createdAt.toISOString(), // Converting createdAt to ISO string
    }));

    // Returning the safeListings array
    return safeListings;
  } catch (error: any) {
    // Throwing an error if any occurs during the process
    throw new Error(error);
  }
}
