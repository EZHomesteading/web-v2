import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import Fuse from "fuse.js";
import haversine from "haversine-distance";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";
  const lat = searchParams.get("lat") || "";
  const lng = searchParams.get("lng") || "";
  const radius = searchParams.get("radius") || "30000";

  try {
    const listings = await prisma.listing.findMany({
      include: {
        user: true,
      },
    });

    let filteredListings = listings;

    if (lat !== "" && lng !== "") {
      filteredListings = listings.filter((listing) => {
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
    }

    if (query !== "") {
      const fuseOptions = {
        keys: ["user.name", "title", "category", "subCategory", "description"],
        threshold: 0.3,
      };
      console.log("query:", query);
      const fuse = new Fuse(filteredListings, fuseOptions);
      console.log("fuse", fuse);
      const results = fuse.search(query);
      return NextResponse.json(results);
    } else return NextResponse.json(filteredListings);
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while searching listings" },
      { status: 500 }
    );
  }
}
