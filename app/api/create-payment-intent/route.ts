import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const calculateOrderAmount = (listings: any) => {
  return 1400;
};

export async function POST(request: NextRequest) {
  const { listings } = await request.json();

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(listings),
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating PaymentIntent:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
