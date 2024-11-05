import authCache from "@/auth-cache";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
const session = await authCache()
  try {
    const wishlists = await prisma.wishlistGroup.findMany({
      where: {
        userId: session?.user?.id
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