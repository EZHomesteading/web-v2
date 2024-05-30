//stripe terms of service eccept route
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export async function POST(request: Request) {
  const currentTimestampSeconds = Math.floor(Date.now() / 1000);
  const body = await request.json();
  const stripeAccountId = body.stripeAccountId;
  try {
    if (typeof stripeAccountId !== "string") {
      throw new Error("Stripe account ID must be a string.");
    }

    const account = await stripe.accounts.update(stripeAccountId, {
      tos_acceptance: {
        date: currentTimestampSeconds,
        ip: "8.8.8.8",
      },
    });
    return NextResponse.json(account);
  } catch (error) {
    console.error("Error onboarding Stripe connected account:", error);
    return NextResponse.json(
      {
        error:
          "An error occurred while onboarding the Stripe connected account",
      },
      { status: 500 }
    );
  }
}
