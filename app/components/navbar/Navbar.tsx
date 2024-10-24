//default navbar parent element

import NavbarClient from "@/app/components/navbar/navbar.client";
import { Location, UserRole } from "@prisma/client";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

import getHarvestMessages from "@/actions/getHarvestMessages";
import { getUserLocations, NavUser } from "@/actions/getUser";

interface p {
  user?: NavUser;
  isDashboard?: boolean;
  isMarketPage?: boolean;
  isChat?: boolean;
  isHome?: boolean;
}

const apiKey = process.env.MAPS_KEY as string;

const Navbar = async ({
  user,
  isChat,
  isDashboard,
  isMarketPage,
  isHome,
}: p) => {
  let uniqueUrl = "";
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
  if (user && (user.name || user.role === UserRole.CONSUMER) && !user.url) {
    const nameToUse = user.name || `vendor${user.id}`;
    uniqueUrl = await generateUniqueUrl(nameToUse);
  }
  // let locations =[]
  // if (user && user.id) {
  //   locations = await getUserLocations({
  //     userId: user?.id,
  //   });
  // }

  const harvestMessages = await getHarvestMessages(user?.id);
  return (
    <NavbarClient
      user={user}
      apiKey={apiKey}
      canReceivePayouts={canReceivePayouts}
      uniqueUrl={uniqueUrl}
      isDashboard={isDashboard}
      isMarketPage={isMarketPage}
      isChat={isChat}
      isHome={isHome}
      harvestMessages={harvestMessages}
    />
  );
};

export default Navbar;
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
