import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export async function POST(request: Request) {
  const date = Date.now();
  try {
    const account = await stripe.accounts.update("acct_1P4pyXIgRwkZrxF0", {
      tos_acceptance: {
        date: date,
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
