import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import prisma from "@/lib/prismadb";
import { Prisma } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received body:", JSON.stringify(body, null, 2));

    const { location, locationId } = body;

    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cleanLocation = (loc: any) => {
      const { 
        type, coordinates, address, hours, role, id,
        ancestorOrigins, href, origin, protocol, host, 
        hostname, port, pathname, search, hash, 
        ...rest
      } = loc;
      return { type, coordinates, address, hours, role, ...rest };
    };

    let updatedLocation;

    const existingLocation = await prisma.location.findFirst({
      
      where: { id : locationId}
    });


    if (existingLocation) {
      console.log("Updating existing location");
      updatedLocation = await prisma.location.update({
        where: { id: locationId },
        data: cleanLocation(location[0]),
      });
    } else {
      console.log("Creating new location");
      updatedLocation = await prisma.location.create({
        data: {
          ...cleanLocation(location[0]),
          userId: user.id,
          isDefault: await prisma.location.count({ where: { userId: user.id } }) === 0,
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