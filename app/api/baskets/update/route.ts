import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { id, proposedLoc, deliveryDate, pickupDate, orderMethod, items } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }
  console.log(deliveryDate)
  try {
    const updatedBasket = await prisma.basket.update({
      where: { id },
      data: {
        proposedLoc:proposedLoc,
        deliveryDate:deliveryDate,
        pickupDate:pickupDate,
        orderMethod:orderMethod,
        items: {
          updateMany: items.map((item:any) => ({
            where: { listingId: item.listingId },
            data: { quantity: item.quantity },
          })),
        },
      },
    })
    console.log(updatedBasket)
    return NextResponse.json(updatedBasket);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update basket" },
      { status: 500 }
    );
  }
}
