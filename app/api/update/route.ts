// Importing the necessary modules and functions
import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUserAsync";
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
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.error();
  }

  const user = await prisma.user.update({
    where: {
      id: currentUser.id,
    },
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

  return NextResponse.json(user);
}
