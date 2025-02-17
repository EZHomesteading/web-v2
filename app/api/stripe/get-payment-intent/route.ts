// app/api/stripe/get-payment-intent/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { paymentIntentId } = body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    return NextResponse.json({
      paymentMethodId: paymentIntent.payment_method,
    });
  } catch (error: any) {
    console.error("Error retrieving payment intent:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
