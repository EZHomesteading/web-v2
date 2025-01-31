import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  const { id, items } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    const updatedBasket = await prisma.basket.update({
      where: { id },
      data: {
        items: {
          deleteMany: {
            listingId: {
              in: items,
            },
          },
        },
      },
      include: {
        items: true,
      },
    });

    // If basket has no items left, delete it
    if (updatedBasket.items.length === 0) {
      await prisma.basket.delete({
        where: { id },
      });
      return NextResponse.json({ deleted: true });
    }

    return NextResponse.json(updatedBasket);
  } catch (error) {
    console.error("Error deleting items from basket:", error);
    return NextResponse.json(
      { error: "Failed to delete items from basket" },
      { status: 500 }
    );
  }
}
