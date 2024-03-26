import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import prisma from "@/app/libs/prismadb";

type HoursOfOperation = {
  [key: string]: { start: string; end: string }[];
};

export async function POST(request: Request) {
  const body = await request.json();
  const {
    street,
    city,
    zip,
    phoneNumber,
    state,
    role,
    name,
    email,
    hoursOfOperation,
  } = body;

  const user = await currentUser();

  if (!user) {
    return NextResponse.error();
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      street,
      city,
      zip,
      phoneNumber,
      state,
      role,
      name,
      email,
      hoursOfOperation: hoursOfOperation as HoursOfOperation,
    },
  });

  return NextResponse.json(updatedUser);
}
