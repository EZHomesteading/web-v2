import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET() {
  try {
    const listings = await prisma.listing.findMany({
      select: {
        title: true,
        subCategory: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json({ listings });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error fetching listings", error: error.message },
      { status: 500 }
    );
  }
}
