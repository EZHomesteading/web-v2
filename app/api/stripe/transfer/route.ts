//tranfer $$ between stripe and users on site.
import { getOrderByIdTransfer } from "@/actions/getOrder";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

interface TransferData {
  total: number;
  paymentId: string;
  orderId: string;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { total, paymentId, orderId } = body as TransferData;
  async function getPaymentIntent(paymentIntentId: string) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId
      );
      console.log(paymentIntent);
      return paymentIntent;
    } catch (error) {
      console.error("Error retrieving payment intent:", error);
      throw error;
    }
  }
  const paymentIntent = await getPaymentIntent(paymentId);
  console.log(paymentIntent);
  const order = await getOrderByIdTransfer({ orderId: orderId });
  console.log(order);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  } else if (
    order.seller &&
    order.seller.stripeAccountId !== paymentIntent?.metadata.sellerStripeID
  ) {
    return NextResponse.json(
      { error: "Invalid Stripe account" },
      { status: 400 }
    );
  }

  try {
    const transfer = await stripe.transfers.create({
      amount: total,
      currency: "usd",
      destination: paymentIntent?.metadata.sellerStripeID,
      description: "Transfer to vendor",
    });

    return NextResponse.json(
      { message: "Transfer initiated successfully", transfer },
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
