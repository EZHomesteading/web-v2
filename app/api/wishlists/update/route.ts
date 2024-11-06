import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { id, proposedLoc, deliveryDate, pickupDate, orderMethod, items } = await req.json();
  console.log(id, proposedLoc, deliveryDate, pickupDate, orderMethod, items)
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }
  console.log(deliveryDate)
  try {
    const updatedWishlist = await prisma.wishlistGroup.update({
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
    });
    return NextResponse.json(updatedWishlist);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update wishlist" },
      { status: 500 }
    );
  }
}
