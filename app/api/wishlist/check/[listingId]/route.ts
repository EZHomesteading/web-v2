// app/api/wishlist/check/[listingId]/route.ts
import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import prisma from "@/lib/prismadb";

interface IParams {
  listingId: string;
}

export async function GET(request: Request, { params }: { params: IParams }) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { listingId } = params;

    if (!listingId) {
      return new NextResponse("Listing ID is required", { status: 400 });
    }

    // Find wishlist item for this listing
    const wishlistItem = await prisma.wishlistItem.findFirst({
      where: {
        listingId,
        wishlistGroup: {
          userId: user.id,
          status: "ACTIVE",
        },
      },
      include: {
        wishlistGroup: true,
      },
    });

    if (!wishlistItem) {
      return NextResponse.json(null);
    }

    // Ensure we return the item ID
    return NextResponse.json({
      id: wishlistItem.id,
      quantity: wishlistItem.quantity,
      wishlistGroup: wishlistItem.wishlistGroup,
      listingId: wishlistItem.listingId,
    });
  } catch (error) {
    console.error("[WISHLIST_CHECK]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
