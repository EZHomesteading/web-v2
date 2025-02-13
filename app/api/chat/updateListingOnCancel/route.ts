import { getListingByIdUpdate } from "@/actions/getListings";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { order } = body;

    if (!order || !order.items || !Array.isArray(order.items)) {
      return NextResponse.json(
        { error: "Invalid order data" },
        { status: 400 }
      );
    }

    // Use Promise.all to handle multiple updates correctly
    await Promise.all(
      order.items.map(async (item: any) => {
        const listing = await getListingByIdUpdate({
          listingId: item.listing.id,
        });

        if (!listing) {
          console.error(`No listing found for ID: ${item.listing.id}`);
          return;
        }

        return prisma.listing.update({
          where: { id: item.listing.id },
          data: {
            stock: listing.stock + item.quantity,
          },
        });
      })
    );

    return NextResponse.json({ message: "Listing quantities updated" });
  } catch (error) {
    console.error("Error in updateListingOnCancel:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
