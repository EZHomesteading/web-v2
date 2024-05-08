import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export async function POST(request: Request) {
  const body = await request.json();
  const { userId } = body;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const account = await stripe.accounts.create({
      country: "US",
      type: "custom",
      business_type: "individual",
      email: user?.email,
      business_profile: {
        name: user?.name,
        url: `https://www.ezhomesteading.com/store/${user?.id}`,
        product_description: "Agriculture and Farming",
        mcc: "0763",
      },
      default_currency: "usd",
      capabilities: {
        card_payments: {
          requested: true,
        },
        transfers: {
          requested: true,
        },
      },
      individual: {
        phone: user?.phoneNumber ?? "",
        address: {
          line1: user?.location?.address[0],
          city: user?.location?.address[1],
          state: user?.location?.address[2],
          postal_code: user?.location?.address[3],
        },
      },
    });

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { stripeAccountId: account.id },
    });
    console.log(updatedUser);
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error creating Stripe connected account:", error);
    return NextResponse.json(
      {
        error: "An error occurred while creating the Stripe connected account",
      },
      { status: 500 }
    );
  }
}
