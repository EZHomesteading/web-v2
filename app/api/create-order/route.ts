//route to create order objects in database, only create, no delete.
import { NextResponse, NextRequest } from "next/server";
import { currentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getListingById } from "@/actions/getListings";

export async function POST(request: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.error();
  }

  const body = await request.json();
  const orders = body;

  const createdOrders = [];

  for (const order of orders) {
    const { listingIds, pickupDate, quantity, totalPrice, status } = order;

    const requiredFields = [
      "userId",
      "listingIds",
      "pickupDate",
      "quantity",
      "totalPrice",
    ];

    if (requiredFields.some((field) => !order[field])) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const listingId: any = listingIds[0];
    const listing = await getListingById({ listingId });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }
    if (!user.id) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    try {
      const newOrder = await prisma.order.create({
        data: {
          userId: user.id,
          listingIds,
          sellerId: listing.user.id,
          pickupDate,
          quantity,
          totalPrice,
          status,
          fee: totalPrice * 0.06,
        },
        include: {
          buyer: true,
          seller: true,
        },
      });
      createdOrders.push(newOrder);
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(createdOrders, { status: 200 });
}
