// Importing the necessary modules and functions
import prisma from "@/app/libs/prismadb";

// Interface defining the structure of parameters accepted by the function
interface IParams {
  listingId?: string; // Optional parameter: listingId
}

// Function to retrieve a listing by its ID
export default async function getListingById(
  params: IParams // Accepting parameters of type IParams
) {
  try {
    const { listingId } = params; // Destructuring listingId from the parameters

    // Finding the listing in the database based on its ID
    const listing = await prisma.listing.findUnique({
      where: {
        id: listingId, // Searching by listingId
      },
      include: {
        user: true, // Including associated user details
      },
    });

    // If listing is not found, return null
    if (!listing) {
      return null;
    }

    // Returning the listing data with modified date formats and user details
    return {
      ...listing,
      createdAt: listing.createdAt.toString(), // Converting createdAt to string
      user: {
        ...listing.user,
        createdAt: listing.user.createdAt.toString(), // Converting user's createdAt to string
        updatedAt: listing.user.updatedAt.toString(), // Converting user's updatedAt to string
        emailVerified: listing.user.emailVerified?.toString() || null, // Converting user's emailVerified to string or null if not available
      },
    };
  } catch (error: any) {
    // Throwing an error if any occurs during the process
    throw new Error(error);
  }
}
