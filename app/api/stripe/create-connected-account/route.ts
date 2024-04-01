import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";
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
      type: "express",
      email: user.email,
      business_profile: {
        name: user.name,
      },
    });

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { stripeAccountId: account.id },
    });

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
