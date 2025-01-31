// app/api/ordergroup/route.ts
import { NextResponse, NextRequest } from "next/server";
import { currentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.error();
  }

  const body = await request.json();
  const { startLoc, endLoc } = body;

  if (!startLoc) {
    return NextResponse.json(
      { error: "Missing location data" },
      { status: 400 }
    );
  }

  try {
    const orderGroup = await prisma.orderGroup.create({
      data: {
        startLoc,
        endLoc,
        orderids: [], // Empty array initially
      },
    });

    return NextResponse.json(orderGroup, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create order group" },
      { status: 500 }
    );
  }
}
