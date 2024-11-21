// app/api/locations/route.ts
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

// Make sure to export the GET function
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const locationIds = searchParams.get("ids")?.split(",") || [];

    if (!locationIds.length) {
      return NextResponse.json(
        { error: "No location IDs provided" },
        { status: 400 }
      );
    }

    const locations = await prisma.location.findMany({
      where: {
        id: {
          in: locationIds,
        },
      },
      select: {
        id: true,
        displayName: true,
        coordinates: true,
        address: true,
        hours: true,
      },
    });

    return NextResponse.json(locations);
  } catch (error) {
    console.error("[LOCATIONS_GET]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
