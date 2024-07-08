import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  try {
    const user = await prisma.user.findUnique({
      where: { id: id as string },
      select: {
        name: true,
        firstName: true,
        image: true,
        url: true,
        listings: {
          select: {
            imageSrc: true,
          },
          take: 5,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const allImageSrcs = user.listings.flatMap((listing) => listing.imageSrc);

    const uniqueImageSrcs = [...new Set(allImageSrcs)].slice(0, 3);

    const modifiedUser = {
      ...user,
      listings: uniqueImageSrcs.map((imageSrc) => ({ imageSrc })),
    };

    return NextResponse.json(modifiedUser);
  } catch (error) {
    console.error("Error fetching marker info:", error);
    return NextResponse.json(
      { error: "Error fetching marker info" },
      { status: 500 }
    );
  }
}
