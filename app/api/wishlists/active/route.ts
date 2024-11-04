import authCache from "@/auth-cache";
import prisma from "@/lib/prisma";
import { wishlistStatus } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await authCache()

  if (!session) {
    return null
  }

  try {
    const wishlists = await prisma.wishlistGroup.findMany({
      where: {
        userId: session?.user?.id,
        status: wishlistStatus.ACTIVE
      },
    });
    return NextResponse.json(wishlists);
  } catch (error) {
    return NextResponse.json(
      { error: "" },
      { status: 500 }
    );
  }
}