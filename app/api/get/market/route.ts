import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import Fuse from "fuse.js";
import { UserRole } from "@prisma/client";

// Haversine formula to calculate distance between points
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in miles
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = parseFloat(searchParams.get("lat") || "0");
    const lng = parseFloat(searchParams.get("lng") || "0");
    const radius = parseInt(searchParams.get("radius") || "50"); // Default to 50 miles if not specified
    const q = searchParams.get("q");
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = parseInt(searchParams.get("perPage") || "36");
    const skip = (page - 1) * perPage;

    // Get all listings first
    let listings = await prisma.listing.findMany({
      where: {
        locationId: {
          not: null,
        },
      },
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
        coordinates: true, // Make sure to include coordinates
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

    // Create lookup maps
    const locationMap = new Map(locations.map((loc) => [loc.id, loc]));
    const userMap = new Map(users.map((user) => [user.id, user]));

    // Transform and filter listings based on distance if coordinates are provided
    let transformedListings = listings
      .map((listing) => {
        const location = listing.locationId
          ? locationMap.get(listing.locationId)
          : null;
        if (!location) return null;

        // Calculate distance if coordinates are provided
        let distance = null;
        if (lat && lng && location.coordinates) {
          distance = calculateDistance(
            lat,
            lng,
            location.coordinates[1], // latitude is second element
            location.coordinates[0] // longitude is first element
          );
        }

        return {
          id: listing.id,
          title: listing.title,
          imageSrc: listing.imageSrc,
          price: listing.price,
          rating: listing.rating,
          quantityType: listing.quantityType,
          location: {
            displayName: location.displayName || "",
            address: location.address || [],
            role: location.role as UserRole,
            hours: location.hours || {
              pickup: [],
              delivery: [],
            },
            coordinates: location.coordinates,
            distance: distance, // Include distance in the response
          },
          minOrder: listing.minOrder,
          user: userMap.get(listing.userId) || { id: "", name: "" },
        };
      })
      .filter((listing): listing is NonNullable<typeof listing> => {
        if (!listing) return false;

        // If coordinates are provided, filter by distance
        if (lat && lng && listing.location.coordinates) {
          return (
            listing.location.distance !== null &&
            listing.location.distance <= radius
          );
        }
        return true;
      });

    // Apply search if query exists
    if (q) {
      const fuseOptions = {
        includeScore: true,
        keys: ["title", "user.name"],
        threshold: 0.3,
      };
      const fuse = new Fuse(transformedListings, fuseOptions);
      const results = fuse.search(q);
      transformedListings = results.map((result) => result.item);
    }

    // Calculate total items before pagination
    const totalItems = transformedListings.length;

    // Apply pagination
    const paginatedListings = transformedListings.slice(skip, skip + perPage);

    return NextResponse.json({
      listings: paginatedListings,
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
