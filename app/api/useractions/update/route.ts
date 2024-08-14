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
    stripeAccountId,
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
      location,
      stripeAccountId,
    },
  });

  return NextResponse.json(updatedUser);
}
