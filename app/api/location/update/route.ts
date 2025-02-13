import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      locationId,
      displayName,
      type,
      coordinates,
      address,
      hours,
      role,
      SODT,
      bio,
      image,
      isDefault,
      showPreciseLocation,
    } = body;

    if (!locationId) {
      return NextResponse.json(
        { error: "Location ID is required" },
        { status: 400 }
      );
    }

    const updatedLocation = await prisma.location.update({
      where: { id: locationId },
      data: {
        displayName,
        type,
        coordinates,
        address,
        hours,
        role,
        SODT,
        bio,
        image,
        isDefault,
        showPreciseLocation,
      },
    });

    console.log(updatedLocation);

    return NextResponse.json({ location: updatedLocation }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
