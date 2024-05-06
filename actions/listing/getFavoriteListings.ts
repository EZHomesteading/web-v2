import prisma from "@/lib/prismadb";
import { currentUser } from "@/lib/auth";

export default async function getFavoriteListings() {
  try {
    const user = await currentUser();
    if (!user) {
      return [];
    }

    const favorites = await prisma.listing.findMany({
      where: {
        id: {
          in: [...(user.favoriteIds || [])], // Filtering by user's favoriteIds
        },
      },
    });

    const safeFavorites = favorites.map((favorite) => ({
      ...favorite,
      createdAt: favorite.createdAt.toString(), // Converting createdAt to string
    }));

    return safeFavorites;
  } catch (error: any) {
    throw new Error(error);
  }
}
