import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import prisma from "@/lib/prismadb";
import { Prisma, UserRole } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { address, lat, lng } = body;

    // Verify user is authenticated
    const user = await currentUser();
    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Format coordinates and address for Prisma
    const coordinates = [lng, lat];
    const formattedAddress = [address];

    // First, find the user's default location if it exists
    const existingLocation = await prisma.location.findFirst({
      where: {
        userId: user.id,
        isDefault: true,
      },
    });

    let updatedLocation;

    if (existingLocation) {
      // Update existing location
      updatedLocation = await prisma.location.update({
        where: {
          id: existingLocation.id, // Use the actual ID for updating
        },
        data: {
          coordinates,
          address: formattedAddress,
        },
      });
    } else {
      // Create new location
      updatedLocation = await prisma.location.create({
        data: {
          userId: user.id,
          type: "Point",
          coordinates,
          address: formattedAddress,
          role: UserRole.CONSUMER,
          isDefault: true,
        },
      });
    }

    return NextResponse.json(updatedLocation);
  } catch (error) {
    console.error("Error in API route:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Prisma error:", error.message);
    }
    return NextResponse.json(
      { error: "Internal server error", details: error || "Unknown error" },
      { status: 500 }
    );
  }
}
