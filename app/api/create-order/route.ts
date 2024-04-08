import { NextResponse, NextRequest } from "next/server";
import { currentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import getListingById from "@/actions/getListingById";

export async function POST(request: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.error();
  }

  const body = await request.json();
  const { orders } = body;

  const createdOrders = [];

  for (const order of orders) {
    const {
      userId,
      listingId,
      pickupDate,
      quantity,
      totalPrice,
      status,
      stripePaymentIntentId,
      conversationId,
      payments,
    } = order;

    const requiredFields = [
      "userId",
      "listingId",
      "pickupDate",
      "quantity",
      "totalPrice",
      "status",
    ];
    if (requiredFields.some((field) => !order[field])) {
      return NextResponse.error();
    }

    const listing = await getListingById(listingId);
    if (!listing) {
      return NextResponse.error();
    }

    const newOrder = await prisma.order.create({
      data: {
        userId,
        listingId,
        sellerId: listing.user.id,
        pickupDate,
        quantity,
        totalPrice: listing.price * quantity,
        status,
        stripePaymentIntentId,
        stripeSessionId: "",
        fee: totalPrice * 0.06,
        conversationId,
        payments: {
          create: payments,
        },
      },
      include: {
        buyer: true,
        seller: true,
      },
    });

    createdOrders.push(newOrder);
  }

  return NextResponse.json(createdOrders);
}
