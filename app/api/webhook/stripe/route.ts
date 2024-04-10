import axios from "axios";
import prisma from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

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
      const orderTotals = paymentIntentSucceeded.orderTotals;
      const obj = JSON.parse(orderTotals);
      const longerValues = Object.keys(obj).filter((key) => key.length === 24);

      console.log("LONGERID Array", longerValues);
      longerValues.forEach((longerValue: any) => {
        const postconversations = async () => {
          const newConversation: any = await prisma.conversation.create({
            data: {
              users: {
                connect: [
                  {
                    id: paymentIntentSucceeded.userId,
                  },
                  {
                    id: longerValue,
                  },
                ],
              },
            },
            include: {
              users: true,
            },
          });

          const newMessage: any = await prisma.message.create({
            include: {
              seen: true,
              sender: true,
            },
            data: {
              body: "(user) has ordered (insert item) from you, with expected pick up time(insert time), please click confirm when their order is ready to be picked up",

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

          console.log("newCONVO", newMessage);
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
