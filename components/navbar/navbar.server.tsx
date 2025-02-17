//default navbar parent element
import NavbarClient from "@/components/navbar/navbar.client";
// import { UserRole } from "@prisma/client";
// import Stripe from "stripe";
// import prisma from "@/lib/prisma";

// import getHarvestMessages from "@/actions/getHarvestMessages";
import { NavUser } from "@/actions/getUser";

interface p {
  user: NavUser | null;
  className?: string;
}

export default async function Navbar({ user, className = "bg-inherit" }: p) {
  // let uniqueUrl = "";
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  //   apiVersion: "2023-10-16",
  // });
  // const canReceivePayouts =
  //   (user?.stripeAccountId
  //     ? await checkPayoutCapability(user?.stripeAccountId)
  //     : false) || false;
  // async function checkPayoutCapability(stripeAccountId: string) {
  //   try {
  //     const account = await stripe.accounts.retrieve(stripeAccountId);
  //     return account.capabilities?.transfers === "active";
  //   } catch (error) {
  //     console.error("Error checking payout capability:", error);
  //     return null;
  //   }
  // }
  // if (user && (user.name || user.role === UserRole.CONSUMER) && !user.url) {
  //   const nameToUse = user.name || `vendor${user.id}`;
  //   uniqueUrl = await generateUniqueUrl(nameToUse);
  // }

  // const harvestMessages = await getHarvestMessages(user?.id);
  return (
    <>
      <NavbarClient
        user={user}
        // canReceivePayouts={canReceivePayouts}
        // uniqueUrl={uniqueUrl}
        harvestMessages={[]}
        className={className}
      />
    </>
  );
}

// async function generateUniqueUrl(displayName: string): Promise<string> {
//   let url = convertToUrl(displayName);
//   let uniqueUrl = url;
//   while (true) {
//     const existingUrl = await prisma.user.findFirst({
//       where: {
//         url: {
//           equals: uniqueUrl,
//           mode: "insensitive",
//         },
//       },
//     });
//     if (!existingUrl) {
//       break;
//     }
//     uniqueUrl = `${url}`;
//     const existingCityUrl = await prisma.user.findFirst({
//       where: {
//         url: {
//           equals: uniqueUrl,
//           mode: "insensitive",
//         },
//       },
//     });
//     if (!existingCityUrl) {
//       break;
//     }
//     let counter = 1;
//     let numberAppended = false;
//     while (true) {
//       const randomNumber = Math.floor(Math.random() * 10);
//       const urlWithNumber = numberAppended
//         ? `${uniqueUrl}${randomNumber}`
//         : `${uniqueUrl}-${randomNumber}`;
//       const existingUrlWithNumber = await prisma.user.findFirst({
//         where: {
//           url: {
//             equals: urlWithNumber,
//             mode: "insensitive",
//           },
//         },
//       });
//       if (!existingUrlWithNumber) {
//         uniqueUrl = urlWithNumber;
//         break;
//       }
//       numberAppended = true;
//       counter++;
//     }
//   }
//   return uniqueUrl;
// }
// function convertToUrl(displayName: string): string {
//   return displayName
//     .toLowerCase()
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/^-+|-+$/g, "")
//     .replace(/-+/g, "-");
// }
