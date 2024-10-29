import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { currentUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate locationId first since it's required
    if (!body.locationId) {
      return NextResponse.json(
        { error: "Location is required" },
        { status: 400 }
      );
    }

    const {
      keyWords,
      title,
      SODT,
      description,
      imageSrc,
      category,
      quantityType,
      stock,
      shelfLife,
      minOrder,
      harvestDates,
      projectedStock,
      harvestFeatures,
      price,
      subCategory,
      rating,
      review,
      reports,
      locationId,
    } = body;

    // Validate required fields with proper type checking
    const requiredFields = [
      { key: "title", type: "string" },
      { key: "category", type: "string" },
      { key: "stock", type: "number" },
      { key: "price", type: "number" },
      { key: "description", type: "string" },
      { key: "shelfLife", type: "number" },
      { key: "subCategory", type: "string" },
      { key: "minOrder", type: "number" },
      { key: "locationId", type: "string" },
    ];

    for (const field of requiredFields) {
      const value = body[field.key];
      if (value === undefined || value === null) {
        return NextResponse.json(
          { error: `Missing required field: ${field.key}` },
          { status: 400 }
        );
      }

      // Type validation
      if (typeof value !== field.type) {
        return NextResponse.json(
          {
            error: `Invalid type for field ${field.key}. Expected ${
              field.type
            }, got ${typeof value}`,
          },
          { status: 400 }
        );
      }
    }

    // Create listing data
    const listingData = {
      keyWords,
      title,
      SODT,
      description,
      imageSrc,
      category,
      quantityType,
      stock,
      shelfLife,
      minOrder,
      price,
      subCategory,
      rating,
      // Connect both user and location using Prisma relations
      user: {
        connect: {
          id: user.id,
        },
      },
      location: {
        connect: {
          id: locationId,
        },
      },
      // Optional fields
      ...(review !== undefined && { review }),
      ...(reports !== undefined && { reports }),
      ...(harvestDates?.length > 0 && { harvestDates }),
      ...(projectedStock !== undefined && { projectedStock }),
      ...(harvestFeatures !== undefined && { harvestFeatures }),
    };

    // Verify the location exists before creating the listing
    const locationExists = await prisma.location.findUnique({
      where: {
        id: locationId,
      },
    });

    if (!locationExists) {
      return NextResponse.json(
        { error: "Invalid location ID" },
        { status: 400 }
      );
    }

    const listing = await prisma.listing.create({
      data: listingData,
      include: {
        user: true,
        location: true,
      },
    });

    return NextResponse.json(listing);
  } catch (error) {
    console.error("Error creating listing:", error);
    return NextResponse.json(
      {
        error: "Error creating listing",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
