import getListingById from "@/actions/listing/getListingById";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { order } = body;
  const quantities = JSON.parse(order.quantity);
  quantities.map(async (item: { id: string; quantity: number }) => {
    const listing = await getListingById({ listingId: item.id });
    if (!listing) {
      return "no listing with that ID";
    }
    const listings = await prisma.listing.update({
      where: { id: item.id },
      data: {
        stock: listing.stock + item.quantity,
      },
    });
    return NextResponse.json(listing);
  });
  return NextResponse.json("listing quantities Updated");
}
