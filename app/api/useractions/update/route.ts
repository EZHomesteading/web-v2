// update current user.
import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import prisma from "@/lib/prismadb";

export async function POST(request: Request) {
  const body = await request.json();
  const {
    name,
    email,
    phoneNumber,
    role,
    url,
    hasPickedRole,
    image,
    subscriptions,
    notifications,
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
      name,
      email,
      phoneNumber,
      image,
      role: role,
      url,
      hasPickedRole,
      subscriptions,
      notifications,
      stripeAccountId,
    },
  });

  return NextResponse.json(updatedUser);
}
