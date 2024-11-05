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

    // Only get locationId from listing
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: {
        locationId: true,
        price: true,
      },
    });

    if (!listing?.locationId) {
      return new NextResponse("Listing not found", { status: 404 });
    }

    // Check for existing group with minimal data
    let wishlistGroup = await prisma.wishlistGroup.findFirst({
      where: {
        userId: user.id,
        locationId: listing.locationId,
        status: status,
      },
      select: { id: true },
    });

    if (!wishlistGroup) {
      wishlistGroup = await prisma.wishlistGroup.create({
        data: {
          userId: user.id,
          locationId: listing.locationId,
          status: status,
        },
        select: { id: true },
      });
    }

    // Create wishlist item with only necessary data
    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        wishlistGroupId: wishlistGroup.id,
        listingId,
        quantity,
        price: listing.price,
      },
      select: {
        id: true,
        quantity: true,
      },
    });

    return NextResponse.json(wishlistItem);
  } catch (error) {
    console.error("[WISHLIST_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// GET route optimized to only fetch necessary fields
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
          status: "ACTIVE",
        },
      },
      select: {
        id: true,
        quantity: true,
        price: true,
        listingId: true,
        wishlistGroup: {
          select: {
            pickupDate: true,
            locationId: true,
          },
        },
      },
    });

    return NextResponse.json(wishlistItems);
  } catch (error) {
    console.error("[WISHLIST_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
