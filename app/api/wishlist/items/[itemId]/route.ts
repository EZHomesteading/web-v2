// app/api/wishlist/items/[itemId]/route.ts
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

    // First, get the wishlist item to check ownership
    const wishlistItem = await prisma.wishlistItem.findFirst({
      where: {
        id: itemId,
        wishlistGroup: {
          userId: user.id,
        },
      },
      include: {
        wishlistGroup: true,
      },
    });

    if (!wishlistItem) {
      return new NextResponse("Item not found", { status: 404 });
    }

    // Delete the wishlist item
    await prisma.wishlistItem.delete({
      where: { id: itemId },
    });

    // Check if the wishlist group is now empty
    const remainingItems = await prisma.wishlistItem.count({
      where: {
        wishlistGroupId: wishlistItem.wishlistGroupId,
      },
    });

    // If no items remain, delete the group
    if (remainingItems === 0) {
      await prisma.wishlistGroup.delete({
        where: { id: wishlistItem.wishlistGroupId },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[WISHLIST_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
