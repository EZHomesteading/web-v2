import prisma from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// get is cached
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { id } = body.id;
  if (!id) {
    return NextResponse.json(
      { error: "Seller ID is required" },
      { status: 400 }
    );
  }

  const statuses: OrderStatus[] = [OrderStatus.PENDING];
  try {
    const orders = await prisma.order.findMany({
      where: {
        sellerId: id,
        status: { in: statuses as OrderStatus[] },
      },
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
