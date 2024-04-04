import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import prisma from "@/libs/prismadb";
import getListingById from "@/actions/getListingById";

export async function POST(request) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.error();
  }

  const body = await request.json();
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
  } = body;

  const requiredFields = [
    "userId",
    "listingId",
    "pickupDate",
    "quantity",
    "totalPrice",
    "status",
  ];

  if (requiredFields.some((field) => !body[field])) {
    return NextResponse.error();
  }

  const listing = await getListingById(listingId);
  if (!listing) {
    return NextResponse.error();
  }

  const order = await prisma.order.create({
    data: {
      userId,
      listingId,
      pickupDate,
      quantity,
      totalPrice: listing.price * quantity,
      status,
      stripePaymentIntentId,
      stripeSessionId: "",
      seller: {
        connect: {
          id: listing.userId,
        },
      },
      fee: totalPrice * 0.06,
      conversationId,
      payments: {
        create: payments,
      },
    },
  });

  return NextResponse.json(order);
}
