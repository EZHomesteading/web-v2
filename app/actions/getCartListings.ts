// Importing the necessary modules and functions
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUserAsync";

// Function to retrieve the favorite listings for the current user
export default async function getCartListings() {
  try {
    const currentUser = await getCurrentUser();
    // If current user is not available, return an empty array
    if (!currentUser) {
      return [];
    }

    // Finding the favorite listings based on the user's favoriteIds
    const carts = await prisma.listing.findMany({
      where: {
        id: {
          in: [...(currentUser.cartIds || [])], // Filtering by user's favoriteIds
        },
      },
    });

    // Mapping over the favorites to ensure safe handling of data
    const safeCart = carts.map((cart) => ({
      ...cart,
      createdAt: cart.createdAt.toString(), // Converting createdAt to string
    }));

    // Returning the safeFavorites array
    return safeCart;
  } catch (error: any) {
    // Throwing an error if any occurs during the process
    throw new Error(error);
  }
}
