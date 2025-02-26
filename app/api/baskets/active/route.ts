import prisma from "@/lib/prisma";
import { basketStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const session = await auth();
    // console.log("session", session);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const requestedUserId = searchParams.get("userId");

    if (!requestedUserId || requestedUserId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const baskets = await prisma.basket.findMany({
      where: {
        userId: session.user.id,
        status: basketStatus.ACTIVE,
        location: {
          user: {
            id: {
              not: undefined,
            },
          },
        },
      },
      select: {
        id: true,
        createdAt: true,
        items: {
          select: {
            listing: {
              select: {
                imageSrc: true,
              },
            },
          },
        },
        location: {
          select: {
            address: true,
            displayName: true,
            hours: true,
            image: true,
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(baskets);
  } catch (error) {
    console.error("[BASKETS_GET]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
