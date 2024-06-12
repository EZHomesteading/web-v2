// update current user.
import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import prisma from "@/lib/prismadb";

export async function POST(request: Request) {
  const body = await request.json();
  const {
    firstName,
    name,
    email,
    phoneNumber,
    role,
    image,
    location,
    subscriptions,
    notifications,
    bio,
    SODT,
    banner,
  } = body;
  const user = await currentUser();
  if (!user) {
    return NextResponse.error();
  }
  let updatedUser;
  updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      firstName,
      name,
      email,
      phoneNumber,
      image,
      role: role,
      subscriptions,
      notifications,
      bio,
      SODT,
      banner,
    },
  });
  console.log(location);
  updatedUser = await prisma.user.updateMany({
    where: { id: user.id },
    data: {
      location: location.map(
        (loc: {
          type: "Point";
          coordinates: { lng: number; lat: number };
          address: String[];
          hours: any;
        }) => ({
          type: loc.type,
          coordinates: loc.coordinates,
          address: loc.address,
          hours: loc.hours,
        })
      ),
    },
  });
  return NextResponse.json(updatedUser);
}
