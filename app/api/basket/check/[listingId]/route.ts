// app/api/basket/check/[listingId]/route.ts
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

    // Optimized query to only fetch necessary fields
    const basketItem = await prisma.basketItem.findFirst({
      where: {
        listingId,
        basket: {
          userId: user.id,
          status: "ACTIVE",
        },
      },
      select: {
        id: true,
        quantity: true,
        basket: {
          select: {
            pickupDate: true,
            status: true,
          },
        },
      },
    });

    if (!basketItem) {
      return NextResponse.json(null);
    }

    return NextResponse.json(basketItem);
  } catch (error) {
    console.error("[WISHLIST_CHECK]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
