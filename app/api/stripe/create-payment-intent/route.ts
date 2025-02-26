//payment intent API
import { NextRequest, NextResponse } from "next/server";
import { getOrderById } from "@/actions/getOrder";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(request: NextRequest) {
  const {
    totalSum,
    userId,
    orderTotals,
    body,
    email,
    orderId,
    orderGroupId,
    sellerStripeID,
  } = await request.json();

  try {
    if (orderId === null) {
      console.error("Error creating PaymentIntent:");
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
    //const order = await getOrderById(orderId);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalSum,
      currency: "usd",
      statement_descriptor_suffix: "EZHomesteading",
      description: JSON.stringify(body),
      metadata: {
        userId,
        orderGroupId: JSON.stringify(orderGroupId),
        sellerStripeID,
      },
      receipt_email: email,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating PaymentIntent:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
