// File: app/api/update-user-hours/route.ts
import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import prisma from "@/lib/prismadb";
import { Prisma } from "@prisma/client";

type LocationObj = {
  type: string;
  coordinates: number[];
  address: string[];
  hours: Prisma.JsonValue;
};

type Location = {
  "0"?: LocationObj | null;
  "1"?: LocationObj | null;
  "2"?: LocationObj | null;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { location, locationIndex } = body;
    console.log("Location before post", JSON.stringify(location[0].hours.exceptions, null, 2));

    // Get the current user
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch the current user data
    const currentUserData = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!currentUserData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Ensure the location exists
    if (!currentUserData.location) {
      return NextResponse.json({ error: "User has no locations" }, { status: 400 });
    }

    // Ensure the location index is valid
    if (locationIndex < 0 || locationIndex > 2) {
      return NextResponse.json({ error: "Invalid location index" }, { status: 400 });
    }

    // Create a new location object with the updated data
    const updatedLocation: Location = {
        ...currentUserData.location,
        [locationIndex]: {
          ...currentUserData.location[locationIndex as keyof typeof currentUserData.location],
          ...location[0],
          hours: {
            ...location[0].hours,
            exceptions: location[0].hours.exceptions.map((ex: any) => ({
              ...ex,
              date: new Date(ex.date).toISOString(), // Convert to ISO string for storage
            })),
          },
        },
      };
      console.log("Updated location", JSON.stringify(updatedLocation, null, 2));
      const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        location: updatedLocation,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user hours:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}