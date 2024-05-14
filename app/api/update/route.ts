import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import prisma from "@/lib/prismadb";
import { Location, UserRole } from "@prisma/client";

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
    hours,
    subscriptions,
    notifications,
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
      image,
      role: role as UserRole,
      location: location as Location,
      subscriptions,
      hours,
      notifications,
    },
  });
  return NextResponse.json(updatedUser);
}
