//delete user by current user.
import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import prisma from "@/lib/prismadb";

export async function DELETE(request: Request) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.error();
  }

  const userDel = await prisma.user.deleteMany({
    where: {
      id: user.id,
    },
  });

  return NextResponse.json(userDel);
}
