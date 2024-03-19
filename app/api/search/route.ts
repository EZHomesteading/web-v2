import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import Fuse from "fuse.js";
import haversine from "haversine-distance";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";
  const lat = searchParams.get("lat") || "";
  const lng = searchParams.get("lng") || "";
  const radius = searchParams.get("radius") || "20000";

  try {
    const listings = await prisma.listing.findMany();

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

    const fuseOptions = {
      keys: ["title", "category", "subCategory", "description"],
    };
    console.log("query:", query);
    const fuse = new Fuse(nearbyListings, fuseOptions);
    console.log("fuse", fuse);
    const results = fuse.search(query);
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while searching listings" },
      { status: 500 }
    );
  }
}
