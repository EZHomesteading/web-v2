// Importing the necessary modules and functions
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

// Function to retrieve the favorite listings for the current user
export default async function getFavoriteListings() {
  try {
    // Getting the current user
    const currentUser = await getCurrentUser();

    // If current user is not available, return an empty array
    if (!currentUser) {
      return [];
    }

    // Finding the favorite listings based on the user's favoriteIds
    const favorites = await prisma.listing.findMany({
      where: {
        id: {
          in: [...(currentUser.favoriteIds || [])], // Filtering by user's favoriteIds
        },
      },
    });

    // Mapping over the favorites to ensure safe handling of data
    const safeFavorites = favorites.map((favorite) => ({
      ...favorite,
      createdAt: favorite.createdAt.toString(), // Converting createdAt to string
    }));

    // Returning the safeFavorites array
    return safeFavorites;
  } catch (error: any) {
    // Throwing an error if any occurs during the process
    throw new Error(error);
  }
}
