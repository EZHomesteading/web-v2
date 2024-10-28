import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  try {
    const locVendor= await prisma.location.findUnique({
      where: { id: id as string },
      select: {
        listings: {
            select: {
             imageSrc: true,
            },
            take: 5,
          },
        user:{
          select:{
            name: true,
            firstName: true,
            image: true,
            url: true,
            
          }
        }
      },
    });

    if (!locVendor) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 });
    }

    const allImageSrcs = locVendor.listings.flatMap((location) => location.imageSrc);

    const uniqueImageSrcs = [...new Set(allImageSrcs)].slice(0, 3);

    const modifiedLoc = {
      ...locVendor,
      listings: uniqueImageSrcs.map((imageSrc) => ({ imageSrc })),
    };
    console.log(modifiedLoc)
    return NextResponse.json(modifiedLoc);
  } catch (error) {
    console.error("Error fetching marker info:", error);
    return NextResponse.json(
      { error: "Error fetching marker info" },
      { status: 500 }
    );
  }
}
