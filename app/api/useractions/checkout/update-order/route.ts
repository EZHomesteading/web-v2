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
  const { orderId, status, pickupDate, completedAt } = await request.json();
  // Update a single cart item
  if (status) {
    const orderUpdate = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: status,
        pickupDate: pickupDate,
        completedAt: completedAt,
      },
    });

    return NextResponse.json(orderUpdate);
  }
}
