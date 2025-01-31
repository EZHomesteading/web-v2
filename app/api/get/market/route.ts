import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import Fuse from "fuse.js";
import { UserRole } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = parseFloat(searchParams.get("lat") || "0");
    const lng = parseFloat(searchParams.get("lng") || "0");
    const radius = parseInt(searchParams.get("radius") || "30");
    const q = searchParams.get("q");
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = parseInt(searchParams.get("perPage") || "36");
    const skip = (page - 1) * perPage;

    // Get base listings first
    let listings = await prisma.listing.findMany({
      where: {
        locationId: {
          not: null,
        },
      },
      skip,
      take: perPage,
      orderBy: {
        createdAt: "desc",
      },
    });

    // Get locations for these listings
    const locationIds = listings
      .map((listing) => listing.locationId)
      .filter((id) => id !== null) as string[];
    const locations = await prisma.location.findMany({
      where: {
        id: {
          in: locationIds,
        },
      },
      select: {
        id: true,
        displayName: true,
        address: true,
        role: true,
        hours: true,
      },
    });

    // Get users for these listings
    const userIds = listings.map((listing) => listing.userId);
    const users = await prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    // Create lookup maps for quick access
    const locationMap = new Map(locations.map((loc) => [loc.id, loc]));
    const userMap = new Map(users.map((user) => [user.id, user]));

    // Transform the listings to include location and user data
    const transformedListings = listings
      .map((listing) => ({
        id: listing.id,
        title: listing.title,
        imageSrc: listing.imageSrc,
        price: listing.price,
        rating: listing.rating,
        quantityType: listing.quantityType,
        location:
          listing.locationId && locationMap.get(listing.locationId)
            ? {
                displayName:
                  locationMap.get(listing.locationId)?.displayName || "",
                address: locationMap.get(listing.locationId)?.address || [],
                role: locationMap.get(listing.locationId)?.role as UserRole,
                hours: locationMap.get(listing.locationId)?.hours || {
                  pickup: [],
                  delivery: [],
                },
              }
            : null,
        minOrder: listing.minOrder,
        user: userMap.get(listing.userId) || { id: "", name: "" },
      }))
      .filter((listing) => listing.location !== null); // Filter out listings with null locations

    // Get total count of listings with valid locations
    const totalItems = transformedListings.length;

    // Apply search if query exists
    if (q) {
      const fuseOptions = {
        includeScore: true,
        keys: ["title", "user.name"],
        threshold: 0.3,
      };
      const fuse = new Fuse(transformedListings, fuseOptions);
      const results = fuse.search(q);

      return NextResponse.json({
        listings: results.map((result) => result.item),
        totalItems: results.length,
      });
    }

    return NextResponse.json({
      listings: transformedListings,
      totalItems,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: String(error),
      },
      { status: 500 }
    );
  }
}
