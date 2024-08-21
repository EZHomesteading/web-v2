//onboarding parent element
import Onboarding from "./onboarding";
import { Viewport } from "next";
import authCache from "@/auth-cache";
import Stripe from "stripe";

export const viewport: Viewport = {
  themeColor: "#fff",
};

const apiKey = process.env.MAPS_KEY;

const Page = async () => {
  const session = await authCache();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2023-10-16",
  });

  async function checkPayoutCapability(stripeAccountId: string) {
    try {
      const account = await stripe.accounts.retrieve(stripeAccountId);
      return account.capabilities?.transfers === "active";
    } catch (error) {
      console.error("Error checking payout capability:", error);
      return null;
    }
  }

  let stripeAccountId = session?.user.stripeAccountId;
  let canReceivePayouts = false;

  if (
    !stripeAccountId &&
    (session?.user.role === "PRODUCER" || session?.user.role === "COOP")
  ) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/stripe/create-connected-account`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: session?.user?.id }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to create Stripe account");
      }
      const data = await response.json();
      stripeAccountId = data.stripeAccountId;
    } catch (error) {
      console.error("Error creating Stripe account:", error);
    }
  }

  if (stripeAccountId) {
    canReceivePayouts = (await checkPayoutCapability(stripeAccountId)) || false;
  }

  let index = 1;

  return (
    <div>
      {session?.user && (
        <Onboarding
          index={index}
          user={session?.user}
          apiKey={apiKey}
          canReceivePayouts={canReceivePayouts}
          session={session}
        />
      )}
    </div>
  );
};

export default Page;
