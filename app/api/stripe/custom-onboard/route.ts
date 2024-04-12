import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export async function POST(request: Request) {
  const stripeId = await request.json();
  try {
    const accountLink = await stripe.accountLinks.create({
      account: "acct_1P4pyXIgRwkZrxF0",
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/reauth`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/return`,
      type: "account_onboarding",
      collection_options: {
        fields: "eventually_due",
      },
    });
    return NextResponse.json(accountLink);
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
