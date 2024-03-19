import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import Fuse from "fuse.js";
import haversine from "haversine-distance";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const lat = searchParams.get("lat") || "";
  const lng = searchParams.get("lng") || "";
  const radius = searchParams.get("radius") || "30000";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  try {
    const listings = await prisma.listing.findMany({
      include: {
        user: true,
      },
      skip: (page - 1) * limit,
      take: limit,
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

    if (q !== "") {
      const fuseOptions = {
        keys: ["user.name", "title", "category", "subCategory", "description"],
        threshold: 0.3,
      };
      console.log("q:", q);
      const fuse = new Fuse(filteredListings, fuseOptions);
      console.log("fuse", fuse);
      const results = fuse.search(q);
      const paginatedResults = results.slice((page - 1) * limit, page * limit);
      return NextResponse.json(paginatedResults);
    } else return NextResponse.json(filteredListings);
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while searching listings" },
      { status: 500 }
    );
  }
}
