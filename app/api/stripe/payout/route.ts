import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prismadb";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export async function POST(request: Request) {
  try {
    const { userId, stripeAccountId, totalSales, totalPaidOut } =
      await request.json();

    const difference = totalSales - (totalPaidOut || 0);

    if (difference > 0) {
      const connectedAccount = await stripe.accounts.retrieve(stripeAccountId);
      console.log(connectedAccount);
      const externalAccounts = connectedAccount.external_accounts?.data || [];

      if (externalAccounts.length === 0) {
        return NextResponse.json(
          { error: "No bank account found for the connected account" },
          { status: 404 }
        );
      }

      const externalAccount = externalAccounts[0];

      const payout = await stripe.payouts.create({
        amount: difference,
        currency: "usd",
        destination: externalAccount.id,
      });

      await prisma.user.update({
        where: { id: userId },
        data: {
          totalPaidOut: {
            increment: difference,
          },
        },
      });

      return NextResponse.json(payout);
    } else {
      return NextResponse.json({ message: "No payout needed" });
    }
  } catch (error) {
    console.error("Error creating payout:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the payout" },
      { status: 500 }
    );
  }
}
