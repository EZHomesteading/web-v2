import prisma from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import getUserById from "@/actions/getUserById";
import getOrderById from "@/actions/getOrderById";
import getListingById from "@/actions/getListingById";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { error: "Missing Stripe signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      await request.text(),
      sig,
      endpointSecret
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntentSucceeded = event.data.object.metadata as any;
      const orderIdss = paymentIntentSucceeded.orderIds;
      const orderIdsss = orderIdss.replace(/,(?=[^,]*$)/, "");
      const orderIds = JSON.parse(orderIdsss);

      // const obj = JSON.parse(orderTotals);
      orderIds.forEach((orderId: any) => {
        const postconversations = async () => {
          const order = await getOrderById({ orderId });
          if (!order) {
            return;
          }
          console.log("ORDER", order);
          let userId = order?.sellerId;
          const seller = await getUserById({ userId });
          userId = paymentIntentSucceeded.userId;
          const buyer = await getUserById({ userId });
          if (!seller) {
            return;
          }
          if (!buyer) {
            return;
          }
          // let listingTitles = "";
          //   const titles = order.listingIds.forEach(async (listingId) => {
          //     const listing = await getListingById({ listingId });
          //     if (listing) {
          //       listingTitles = listing.title + " and " + listingTitles;
          //       return listingTitles;
          //     } else {
          //       return "";
          //     }
          //   });

          //   console.log(titles);
          const newConversation: any = await prisma.conversation.create({
            data: {
              users: {
                connect: [
                  {
                    id: paymentIntentSucceeded.userId,
                  },
                  {
                    id: order?.sellerId,
                  },
                ],
              },
            },
            include: {
              users: true,
            },
          });
          if (seller.role === "COOP") {
            const newMessage: any = await prisma.message.create({
              include: {
                seen: true,
                sender: true,
              },
              data: {
                body: `${buyer.name} has ordered {listingTitles} from you, with expected pick up time(insert time), please click confirm when their order is ready to be picked up`,

                messageOrder: "1",

                conversation: {
                  connect: { id: newConversation.id },
                },
                sender: {
                  connect: { id: paymentIntentSucceeded.userId },
                },
                seen: {
                  connect: {
                    id: paymentIntentSucceeded.userId,
                  },
                },
              },
            });
          }
          if (seller.role === "PRODUCER") {
            const newMessage: any = await prisma.message.create({
              include: {
                seen: true,
                sender: true,
              },
              data: {
                body: "(user) has ordered (insert item) from you, with expected pick up time of (insert time) on (pickupDate), please click confirm when their order has been delivered",

                messageOrder: "10",

                conversation: {
                  connect: { id: newConversation.id },
                },
                sender: {
                  connect: { id: paymentIntentSucceeded.userId },
                },
                seen: {
                  connect: {
                    id: paymentIntentSucceeded.userId,
                  },
                },
              },
            });
          }

          //window.location.href = `/autochat/${newConversation.id}`;
        };
        postconversations();
      });

      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  return NextResponse.json({ received: true }, { status: 200 });
}
