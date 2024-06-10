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
        },
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching marker info:", error);
    return NextResponse.json(
      { error: "Error fetching marker info" },
      { status: 500 }
    );
  }
}
