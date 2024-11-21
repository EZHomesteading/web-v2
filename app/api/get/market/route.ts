import mongoose from "mongoose";
import connectMongoose from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { MarketListing } from "@/app/(nav_market_layout)/market/_components/market-component";
import Fuse from "fuse.js";

let mongoConnection: mongoose.Connection | null = null;

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

      listings = await prisma.listing.findMany({
        where: {
          locationId: { in: locationIds },
          // user: {canRecievePayouts:true}
        },
        select: {
          id: true,
          title: true,
          imageSrc: true,
          price: true,
          rating: true,
          quantityType: true,
          location: {
            select: { address: true, role: true },
          },
          minOrder: true,
          user: {
            select: {
              id: true,
            },
          },
        },
      });
    } else {
      listings = await prisma.listing.findMany({
        where: {
          location: { isNot: null },
          // user: {canRecievePayouts:true}
        },
        select: {
          id: true,
          title: true,
          imageSrc: true,
          price: true,
          rating: true,
          quantityType: true,
          location: {
            select: { address: true, role: true },
          },
          minOrder: true,
          user: {
            select: {
              id: true,
            },
          },
        },
      });
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
      console.log(results);
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
