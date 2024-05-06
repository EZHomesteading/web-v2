import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(request: NextRequest) {
  const { orderTotals } = await request.json();
  try {
    const paymentIntents = await Promise.all(
      orderTotals.map((amount: number) =>
        stripe.paymentIntents.create({
          amount,
          currency: "usd",
          automatic_payment_methods: { enabled: true },
        })
      )
    );
    return NextResponse.json({
      clientSecrets: paymentIntents.map(
        (paymentIntent) => paymentIntent.client_secret
      ),
    });
  } catch (error) {
    console.error("Error creating PaymentIntent:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
