import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import prisma from "@/lib/prismadb";
import { Hours, Prisma, UserRole } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received body:", JSON.stringify(body, null, 2));

    const { locationId, hours,coordinates,address,role,isDefault } = body as {
      hours?: Hours;
      locationId?: string;
      type?: string;
      coordinates?: number[];
      address?: string[];
      role?: UserRole;
      isDefault?: boolean;
    };
    const user = await currentUser();
    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let updatedLocation;

    if (locationId) {
      console.log("Updating hours for existing location");
      updatedLocation = await prisma.location.update({
        where: { id: locationId },
        data: {
          hours: hours
        },
      });
    } else {
      const locationCount = await prisma.location.count({ where: { userId: user.id } });
      updatedLocation = await prisma.location.create({
        data: {
          userId: user.id,
          type: "Point",
          coordinates: coordinates,
          address: address,
          role: role || UserRole.PRODUCER,
          isDefault: locationCount === 0 || isDefault ,
        },
      });
    }

    console.log("Location updated or created:", updatedLocation);

    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { locations: true },
    });

    console.log("Sending response:", JSON.stringify(updatedUser, null, 2));
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Detailed error in API route:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Prisma error:", error.message);
    }
    return NextResponse.json({ error: "Internal server error", details: (error instanceof Error ? error.message : 'Unknown error') }, { status: 500 });
  }
}