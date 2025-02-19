// app/api/stripe/update-payment-intent/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { paymentIntentId, customerId } = body;

    const paymentIntent = await stripe.paymentIntents.update(paymentIntentId, {
      customer: customerId,
      setup_future_usage: "off_session",
    });

    return NextResponse.json({ updated: true });
  } catch (error: any) {
    console.error("Error updating payment intent:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
