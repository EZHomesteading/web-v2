import authCache from "@/auth-cache";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
const session = await authCache()
  try {
    const baskets = await prisma.basketGroup.findMany({
      where: {
        userId: session?.user?.id
      },
    });
    return NextResponse.json(baskets);
  } catch (error) {
    return NextResponse.json(
      { error: "" },
      { status: 500 }
    );
  }
}