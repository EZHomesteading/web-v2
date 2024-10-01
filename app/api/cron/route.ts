import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prismadb";
import webPush, { PushSubscription } from "web-push";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Verify the request is from your cron service (optional but recommended)
  const apiKey = req.headers["x-api-key"];
  if (apiKey !== process.env.CRON_API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Your daily or monthly task logic here
    console.log("Cron job executed!");
    const newConversation = await prisma.conversation.create({
      data: {
        users: {
          connect: [
            { id: "66f8bf60da8399fd811b9dad" },
            { id: "66c37bb923e78a6e81664437" },
          ],
        },
      },
      include: {
        users: true,
      },
    });
    const newMessage = await prisma.message.create({
      include: {
        seen: true,
        sender: true,
      },
      data: {
        body: "test",
        messageOrder: "100",
        conversation: {
          connect: { id: newConversation.id },
        },
        sender: {
          connect: { id: "66f8bf60da8399fd811b9dad" },
        },
        seen: {
          connect: {
            id: "66f8bf60da8399fd811b9dad",
          },
        },
      },
    });

    //   try {
    //     if (!seller.subscriptions) {
    //       console.error("A users Push subscription has expired.");
    //       return;
    //     }
    //     const formatrecipients = JSON.parse(seller.subscriptions);
    //     const send = formatrecipients.map(
    //       (subscription: PushSubscription) =>
    //         webPush.sendNotification(
    //           subscription,
    //           JSON.stringify({
    //             title: "You have a new order!",
    //             body: coopBody,
    //             id: newConversation.id,
    //           }),
    //           {
    //             vapidDetails: {
    //               subject: "mailto:ezhomesteading@gmail.com",
    //               publicKey: process.env
    //                 .NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY as string,
    //               privateKey: process.env.WEB_PUSH_PRIVATE_KEY as string,
    //             },
    //           }
    //         )
    //     );
    //     await Promise.all(send);
    //   } catch (error) {
    //     console.error("A users Push subscription has expired.");
    //   }
    //Perform your task, e.g., update database, send notifications, etc.

    res.status(200).json({ message: "Cron job completed successfully" });
  } catch (error) {
    console.error("Cron job failed:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
