// app/api/basket/items/[itemId]/route.ts
import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import prisma from "@/lib/prismadb";

interface IParams {
  itemId: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { itemId } = params;

    if (!itemId) {
      return new NextResponse("Item ID is required", { status: 400 });
    }

    // Only fetch the minimal data needed to verify ownership
    const basketItem = await prisma.basketItem.findFirst({
      where: {
        id: itemId,
        basketGroup: {
          userId: user.id,
        },
      },
      select: {
        id: true,
        basketGroupId: true,
      },
    });

    if (!basketItem) {
      return new NextResponse("Item not found", { status: 404 });
    }

    // Delete in transaction to ensure atomicity
    await prisma.$transaction(async (tx) => {
      // Delete the item
      await tx.basketItem.delete({
        where: { id: itemId },
      });

      // Check remaining items count
      const remainingCount = await tx.basketItem.count({
        where: { basketGroupId: basketItem.basketGroupId },
      });

      // If no items remain, delete the group
      if (remainingCount === 0) {
        await tx.basketGroup.delete({
          where: { id: basketItem.basketGroupId },
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[WISHLIST_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
