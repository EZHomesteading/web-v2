import { currentUser } from "@/lib/auth";
import CreateClient from "./CreateClient";
import type { Viewport } from "next";
import CreatePopup from "../(home)/info-modals/create-info-modal";
import Stripe from "stripe";
import { getUserLocations } from "@/actions/getUser";
export const viewport: Viewport = {
  themeColor: "rgb(255,255,255)",
};


const Page = async ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  const user = await currentUser();
  const id = searchParams?.id;

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

  const locations = await getUserLocations({ userId: user?.id });
  const defaultLocation = locations?.find((loc) => loc.id === id);

  return (
    <div>
      {user ? (
        <>
          <CreateClient
            canReceivePayouts={canReceivePayouts}
            index={index}
            user={user}
            locations={locations}
          />
          <CreatePopup />
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
