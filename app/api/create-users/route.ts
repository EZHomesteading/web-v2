//route to create multiple users?
//why do we have this???
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function POST(request: Request) {
  const body = await request.json();

  const users = await prisma.user.createMany({
    data: body,
  });

  return NextResponse.json(users);
}
