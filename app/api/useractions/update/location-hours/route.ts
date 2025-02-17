import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import prisma from "@/lib/prismadb";
import { Prisma, UserRole } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { address, coordinates, role, hours, displayName } =
      body.location[0] || {};

    if (!Array.isArray(coordinates) || !Array.isArray(address)) {
      return NextResponse.json(
        { error: "Invalid coordinates or address format" },
        { status: 400 }
      );
    }

    const user = await currentUser();
    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let updatedLocation;

    const { locationId, isDefault } = body;

    if (locationId) {
      updatedLocation = await prisma.location.update({
        where: { id: locationId },
        data: { hours: hours, displayName: displayName },
      });
    } else {
      const locationCount = await prisma.location.count({
        where: { userId: user.id },
      });

      updatedLocation = await prisma.location.create({
        data: {
          userId: user.id,
          type: "Point",
          coordinates,
          address,
          role: role || UserRole.PRODUCER,
          isDefault: locationCount === 0 || isDefault,
          displayName: displayName,
        },
      });
    }

    return NextResponse.json(updatedLocation);
  } catch (error) {
    console.error("Detailed error in API route:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Prisma error:", error.message);
    }
    return NextResponse.json(
      { error: "Internal server error", details: error || "Unknown error" },
      { status: 500 }
    );
  }
}
