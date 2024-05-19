import getOrderByIdTransfer from "@/actions/getOrderByIdTransfer";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

interface TransferData {
  total: number;
  stripeAccountId: string;
  orderId: string;
  status: number;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { total, stripeAccountId, orderId, status } = body as TransferData;

  const order = await getOrderByIdTransfer({ orderId: orderId });
  if (!order) {
    return null;
  } else if (
    order.status !== status ||
    order.seller.stripeAccountId !== stripeAccountId
  ) {
    return null;
  } else
    try {
      const transfer = await stripe.transfers.create({
        amount: total,
        currency: "usd",
        destination: stripeAccountId,
        description: "Transfer to vendor",
      });

      return NextResponse.json(
        {
          message: "Transfer initiated successfully",
          transfer,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Transfer error:", error);
      return NextResponse.json(
        { error: "Failed to initiate transfer" },
        { status: 500 }
      );
    }
}
