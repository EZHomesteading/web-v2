//onboarding parent element
import { currentUser } from "@/lib/auth";
import Onboarding from "./onboarding";
import { Viewport } from "next";
import authCache from "@/auth-cache";
import Stripe from "stripe";
export const viewport: Viewport = {
  themeColor: "#ced9bb",
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

      const canReceivePayouts = account.capabilities?.transfers === "active";
      return canReceivePayouts;
    } catch (error) {
      console.error("Error checking payout capability:", error);
      return null;
    }
  }

  // Usage
  if (!session?.user?.stripeAccountId) {
    return;
  }
  const stripeAccountId = session?.user?.stripeAccountId;
  const canReceivePayouts = await checkPayoutCapability(stripeAccountId);

  const user = await currentUser();
  let index = 1;
  console.log(session?.user);
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
