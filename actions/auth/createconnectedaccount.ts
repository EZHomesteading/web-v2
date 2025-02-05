"use server";

import { currentUser } from "@/lib/auth";

export async function createStripeConnectedAccount() {
  const user = await currentUser();

  if (!user?.id) {
    throw new Error("User not found");
  }

  const response = await fetch(
    `${process.env.URL}/api/stripe/create-connected-account`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: user.id }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create Stripe connected account: ${errorText}`);
  }

  return await response.json();
}
