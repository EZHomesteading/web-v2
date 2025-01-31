import mongoose from "mongoose";
import connectMongoose from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { MarketListing } from "@/app/(nav_market_layout)/market/_components/market-component";
import Fuse from "fuse.js";
import { UserRole } from "@prisma/client";

let mongoConnection: mongoose.Connection | null = null;

// Prisma select object for consistent querying
const listingSelect = {
  id: true,
  title: true,
  imageSrc: true,
  price: true,
  rating: true,
  quantityType: true,
  location: {
    select: {
      address: true,
      role: true,
      hours: true,
    },
  },
  minOrder: true,
  user: {
    select: {
      id: true,
    },
  },
} as const;

// Transform Prisma result to match MarketListing interface
function transformPrismaResult(prismaResults: any[]): MarketListing[] {
  return prismaResults.map((listing) => ({
    id: listing.id,
    title: listing.title,
    imageSrc: listing.imageSrc,
    price: listing.price,
    rating: listing.rating,
    quantityType: listing.quantityType,
    location: listing.location
      ? {
          address: listing.location.address,
          role: listing.location.role as UserRole,
          hours: {
            pickup: listing.location.hours?.pickup || undefined,
            delivery: listing.location.hours?.delivery || undefined,
            ...listing.location.hours,
          },
        }
      : null,
    minOrder: listing.minOrder,
    user: {
      id: listing.user.id,
    },
  }));
}

export async function GET(req: NextRequest) {
  try {
    if (!mongoConnection || mongoConnection.readyState !== 1) {
      await connectMongoose();
      mongoConnection = mongoose.connection;
    }

    const { searchParams } = new URL(req.url);
    const lat = parseFloat(searchParams.get("lat") || "0");
    const lng = parseFloat(searchParams.get("lng") || "0");
    const radius = parseInt(searchParams.get("radius") || "30");
    const q = searchParams.get("q");
    let listings: MarketListing[] = [];

    if (lat && lng && radius) {
      if (
        isNaN(lat) ||
        isNaN(lng) ||
        Math.abs(lat) > 90 ||
        Math.abs(lng) > 180
      ) {
        return NextResponse.json(
          { message: "Invalid coordinates" },
          { status: 400 }
        );
      }

      const rawCollection = mongoConnection?.db?.collection("Location");
      if (!rawCollection) {
        return NextResponse.json(
          { message: "Database connection error" },
          { status: 500 }
        );
      }

      const geoQuery = {
        coordinates: {
          $geoWithin: {
            $centerSphere: [[lng, lat], radius / 3958.8],
          },
        },
      };

      const locationIds = await rawCollection
        .find(geoQuery)
        .project({ _id: 1 })
        .map((doc) => doc._id.toString())
        .toArray();

      if (!locationIds || locationIds.length === 0) {
        return NextResponse.json(
          { message: "No nearby locations found" },
          { status: 404 }
        );
      }

      const prismaResults = await prisma.listing.findMany({
        where: {
          locationId: { in: locationIds },
        },
        select: listingSelect,
      });

      listings = transformPrismaResult(prismaResults);
    } else {
      const prismaResults = await prisma.listing.findMany({
        where: {
          location: { isNot: null },
        },
        select: listingSelect,
      });

      listings = transformPrismaResult(prismaResults);
    }

    if (q) {
      const fuseOptions = {
        includeScore: true,
        keys: [
          "user.name",
          "title",
          "category",
          "subCategory",
          "description",
          "keyWords",
        ],
        threshold: 0.3,
      };
      const fuse = new Fuse(listings, fuseOptions);
      const results = fuse.search(q);
      listings = results.map((result) => result.item);
    }

    return NextResponse.json(listings);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: String(error),
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
