import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import prisma from "@/lib/prismadb";
import { Prisma, UserRole } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received body:", JSON.stringify(body, null, 2));

    const { location, locationIndex } = body;

    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUserData = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!currentUserData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Initialize locations array if it doesn't exist
    let userLocations = currentUserData.location || [];
    if (!Array.isArray(userLocations)) {
      userLocations = [];
    }

    // If locationIndex is provided and valid, update existing location
    // Otherwise, add a new location
    if (locationIndex !== undefined && locationIndex >= 0 && locationIndex < userLocations.length) {
      userLocations[locationIndex] = { ...userLocations[locationIndex], ...location[0] };
    } else {
      userLocations.push(location[0]);
    }

    console.log("Updated locations:", JSON.stringify(userLocations, null, 2));

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        location: userLocations,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user location:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Prisma error:", error.message);
    }
    return NextResponse.json({ error: "Internal server error", details: "error.message" }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};