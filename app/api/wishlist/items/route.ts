// app/api/wishlist/items/route.ts
import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import prisma from "@/lib/prismadb";

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { listingId, quantity, status = "ACTIVE" } = body;

    if (!listingId) {
      return new NextResponse("Listing ID is required", { status: 400 });
    }

    // Check if a wishlist group exists for this user and location
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { locationId: true },
    });

    if (!listing) {
      return new NextResponse("Listing not found", { status: 404 });
    }

    if (!listing.locationId) {
      return new NextResponse("Invalid location", { status: 400 });
    }

    // Get or create wishlist group
    let wishlistGroup = await prisma.wishlistGroup.findFirst({
      where: {
        userId: user.id,
        locationId: listing.locationId, // This locationId is now guaranteed to be a string
        status: status as
          | "ACTIVE"
          | "SAVED_FOR_LATER"
          | "EXPIRED"
          | "CONVERTED_TO_ORDER",
      },
    });

    if (!wishlistGroup) {
      wishlistGroup = await prisma.wishlistGroup.create({
        data: {
          userId: user.id,
          locationId: listing.locationId, // This locationId is now guaranteed to be a string
          status: status as
            | "ACTIVE"
            | "SAVED_FOR_LATER"
            | "EXPIRED"
            | "CONVERTED_TO_ORDER",
        },
      });
    }

    // Create wishlist item
    const listing_price = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { price: true },
    });

    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        wishlistGroupId: wishlistGroup.id,
        listingId,
        quantity,
        price: listing_price?.price || 0,
      },
    });

    return NextResponse.json(wishlistItem);
  } catch (error) {
    console.error("[WISHLIST_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// GET all wishlist items for current user
export async function GET(request: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const wishlistItems = await prisma.wishlistItem.findMany({
      where: {
        wishlistGroup: {
          userId: user.id,
        },
      },
      include: {
        listing: true,
        wishlistGroup: true,
      },
    });

    return NextResponse.json(wishlistItems);
  } catch (error) {
    console.error("[WISHLIST_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
