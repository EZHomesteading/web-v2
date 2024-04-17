import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import prisma from "@/lib/prismadb";
import { Hours, Location, UserRole } from "@prisma/client";

export async function POST(request: Request) {
  const body = await request.json();
  const {
    firstName,
    name,
    email,
    phoneNumber,
    role,
    location,
    hours,
    subscriptions,
  } = body;
  const user = await currentUser();
  if (!user) {
    return NextResponse.error();
  }
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      firstName,
      name,
      email,
      phoneNumber,
      role: role as UserRole,
      location: location as Location,
      subscriptions,
      hours: hours as Hours,
    },
  });
  return NextResponse.json(updatedUser);
}
