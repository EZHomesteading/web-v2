//update order status and/or pickupdate
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

interface CartParams {
  orderId?: string;
  status?: number;
}
export async function POST(
  request: Request,
  { params }: { params: CartParams }
) {
  const {
    orderId,
    status,
    pickupDate,
    completedAt,
    conversationId,
    deliveryFee,
  } = await request.json();
  // Update a single cart item
  if (status) {
    const orderUpdate = await prisma.order.update({
      where: { id: orderId },
      data: {
        conversationId: conversationId,
        status: status,
        pickupDate: pickupDate,
        completedAt: completedAt,
        fee: { delivery: deliveryFee },
      },
    });

    return NextResponse.json(orderUpdate);
  }
}
