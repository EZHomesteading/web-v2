import { currentUser } from "@/lib/auth";
import CreateClient from "./components/CreateClient";
import type { Viewport } from "next";
import CreatePopup from "../../(white_nav_layout)/info-modals/create-info-modal";
import Stripe from "stripe";
import { getUserLocations } from "@/actions/getUser";

export const viewport: Viewport = {
  themeColor: "rgb(255,255,255)",
};

const Page = async ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  const user = await currentUser();
  let index = 1;

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2023-10-16",
  });

  const canReceivePayouts =
    (user?.stripeAccountId
      ? await checkPayoutCapability(user?.stripeAccountId)
      : false) || false;

  async function checkPayoutCapability(stripeAccountId: string) {
    try {
      const account = await stripe.accounts.retrieve(stripeAccountId);
      return account.capabilities?.transfers === "active";
    } catch (error) {
      console.error("Error checking payout capability:", error);
      return null;
    }
  }
  if (!user?.id) {
    return null;
  }
  const locations = await getUserLocations({ userId: user?.id });
  let defaultId = "";
  if (searchParams) {
    let defaultLocation = locations?.find((loc) => loc.id === searchParams.id);
    if (defaultLocation) {
      defaultId = defaultLocation.id;
    }
  }
  return (
    <div>
      {user ? (
        <>
          <CreateClient
            defaultId={defaultId}
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
};
export default Page;
