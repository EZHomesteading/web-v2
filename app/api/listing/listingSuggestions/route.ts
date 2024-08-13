import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      { message: "Query parameter is required" },
      { status: 400 }
    );
  }

  try {
    const listings = await prisma.listing.findMany({
      where: {
        title: { contains: query, mode: "insensitive" },
      },
      select: {
        title: true,
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
