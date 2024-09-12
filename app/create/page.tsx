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
  let uniqueUrl = "";
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
  if (user && (user.name || user.role === UserRole.CONSUMER)) {
    const nameToUse = user.name || `vendor${user.id}`;
    uniqueUrl = await generateUniqueUrl(nameToUse);
  }

  return (
    <div>
      {user ? (
        <>
          <CreateClient
            canReceivePayouts={canReceivePayouts}
            index={index}
            user={user}
            uniqueUrl={uniqueUrl}
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

async function generateUniqueUrl(displayName: string): Promise<string> {
  let url = convertToUrl(displayName);
  let uniqueUrl = url;
  while (true) {
    const existingUrl = await prisma.user.findFirst({
      where: {
        url: {
          equals: uniqueUrl,
          mode: "insensitive",
        },
      },
    });
    if (!existingUrl) {
      break;
    }
    uniqueUrl = `${url}`;
    const existingCityUrl = await prisma.user.findFirst({
      where: {
        url: {
          equals: uniqueUrl,
          mode: "insensitive",
        },
      },
    });
    if (!existingCityUrl) {
      break;
    }
    let counter = 1;
    let numberAppended = false;
    while (true) {
      const randomNumber = Math.floor(Math.random() * 10);
      const urlWithNumber = numberAppended
        ? `${uniqueUrl}${randomNumber}`
        : `${uniqueUrl}-${randomNumber}`;
      const existingUrlWithNumber = await prisma.user.findFirst({
        where: {
          url: {
            equals: urlWithNumber,
            mode: "insensitive",
          },
        },
      });
      if (!existingUrlWithNumber) {
        uniqueUrl = urlWithNumber;
        break;
      }
      numberAppended = true;
      counter++;
    }
  }
  return uniqueUrl;
}

function convertToUrl(displayName: string): string {
  return displayName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}
