//tranfer $$ between stripe and users on site.
import { getOrderByIdTransfer } from "@/actions/getOrder";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

interface TransferData {
  total: number;
  stripeAccountId: string;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { total, stripeAccountId } = body as TransferData;

  try {
    const payout = await stripe.payouts.create(
      {
        amount: total,
        currency: "usd",
      },
      {
        stripeAccount: stripeAccountId,
      }
    );

    return NextResponse.json(
      { message: "Transfer initiated successfully", payout },
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
