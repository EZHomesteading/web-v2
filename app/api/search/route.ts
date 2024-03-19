import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import Fuse from "fuse.js";
import haversine from "haversine-distance";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";
  const lat = searchParams.get("lat") || "";
  const lng = searchParams.get("lng") || "";
  const radius = searchParams.get("radius") || "";

  try {
    const listings = await prisma.listing.findMany({
      include: {
        user: true,
      },
    });

    const nearbyListings = listings.filter((listing) => {
      const listingLocation = listing.location as {
        coordinates: [number, number];
      };
      const listingCoordinates = {
        latitude: listingLocation.coordinates[1],
        longitude: listingLocation.coordinates[0],
      };
      const userLocation = {
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
      };
      const distance = haversine(listingCoordinates, userLocation);
      return distance <= parseFloat(radius);
    });

    console.log("Nearby Listings:", nearbyListings);

    const fuse = new Fuse(nearbyListings, {
      keys: ["title", "category", "subCategory", "description"],
      threshold: 0.3,
    });

    const searchResults = fuse.search(query);

    console.log("Search Results:", searchResults);

    return NextResponse.json(searchResults);
  } catch (error) {
    console.error("Error searching listings:", error);
    return NextResponse.json(
      { error: "An error occurred while searching listings" },
      { status: 500 }
    );
  }
}
