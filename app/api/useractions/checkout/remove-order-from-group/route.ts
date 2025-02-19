// app/api/ordergroup/remove-order/route.ts
import { NextResponse, NextRequest } from "next/server";
import { currentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { orderGroupId, orderId } = body;

  if (!orderGroupId || !orderId) {
    return NextResponse.json(
      { error: "Missing orderGroupId or orderId" },
      { status: 400 }
    );
  }

  try {
    // First, fetch the current orderGroup to get the existing orderids
    const existingOrderGroup = await prisma.orderGroup.findUnique({
      where: {
        id: orderGroupId,
      },
    });

    if (!existingOrderGroup) {
      return NextResponse.json(
        { error: "OrderGroup not found" },
        { status: 404 }
      );
    }

    // Filter out the specified orderId
    const updatedOrderIds = existingOrderGroup.orderids.filter(
      (id) => id !== orderId
    );

    // Update the orderGroup with the new orderids array
    const updatedOrderGroup = await prisma.orderGroup.update({
      where: {
        id: orderGroupId,
      },
      data: {
        orderids: updatedOrderIds,
      },
    });

    return NextResponse.json(updatedOrderGroup, { status: 200 });
  } catch (error) {
    console.error("Error removing order from group:", error);
    return NextResponse.json(
      { error: "Failed to remove order from group" },
      { status: 500 }
    );
  }
}
