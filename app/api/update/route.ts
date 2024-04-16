import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import prisma from "@/lib/prismadb";
import { Location } from "@prisma/client";
type HoursOfOperation = { [key: string]: { start: string; end: string }[] };

export async function POST(request: Request) {
  const body = await request.json();
  const {
    firstName,
    name,
    email,
    phoneNumber,
    role,
    location,

    hoursOfOperation,
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
      role,
      location: location as Location,

      subscriptions,
      hoursOfOperation: hoursOfOperation as HoursOfOperation,
    },
  });
  return NextResponse.json(updatedUser);
}
