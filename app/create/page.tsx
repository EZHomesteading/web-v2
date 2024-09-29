import { currentUser } from "@/lib/auth";
import CreateClient from "./CreateClient";
import type { Viewport } from "next";
import CreatePopup from "../(home)/info-modals/create-info-modal";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import Stripe from "stripe";
export const viewport: Viewport = {
  themeColor: "rgb(255,255,255)",
};

const Page = async () => {
  const user = await currentUser();
  let index = 1;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2023-10-16",
  });
  const canReceivePayouts =
    (user?.stripeAccountId
      ? await checkPayoutCapability(user?.stripeAccountId)
      : false) || false;
  console.log(user?.hasPickedRole);
  async function checkPayoutCapability(stripeAccountId: string) {
    try {
      const account = await stripe.accounts.retrieve(stripeAccountId);
      return account.capabilities?.transfers === "active";
    } catch (error) {
      console.error("Error checking payout capability:", error);
      return null;
    }
  }

  return (
    <div>
      {user ? (
        <>
          <CreateClient
            canReceivePayouts={canReceivePayouts}
            index={index}
            user={user}
          />
          <CreatePopup />
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Page;
