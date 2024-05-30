//stripe create payment session
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(request: NextRequest) {
  const { stripeAccountId } = await request.json();
  try {
    const accountSession = await stripe.accountSessions.create({
      account: stripeAccountId,
      components: {
        account_onboarding: {
          enabled: true,
        },
        payments: {
          enabled: true,
        },
        payouts: {
          enabled: true,
        },
      },
    });

    return NextResponse.json({ client_secret: accountSession.client_secret });
  } catch (error) {
    console.error(
      "An error occurred when calling the Stripe API to create an account session",
      error
    );
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
