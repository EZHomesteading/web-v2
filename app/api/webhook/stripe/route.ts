import prisma from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import getUserById from "@/actions/user/getUserById";
import getOrderById from "@/actions/getOrderById";
import getListingById from "@/actions/listing/getListingById";
import AWS from "@/aws-config";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
const sns = new AWS.SNS();
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

  switch (event.type) {
    case "payment_intent.succeeded":
      const pi = event.data.object.metadata as any;
      const buyerId = pi.userId;
      const a = pi.orderIds;
      const b = a.replace(/,(?=[^,]*$)/, "");
      const orderIds = JSON.parse(b);

      await prisma.cart.deleteMany({
        where: { userId: pi.userId },
      });

      for (const orderId of orderIds) {
        const postconversations = async () => {
          const order = await getOrderById({ orderId });
          if (!order) {
            return;
          }

          const seller = await getUserById({ userId: order.sellerId });
          const buyer = await getUserById({ userId: buyerId });

          if (!seller || !buyer) {
            return "one of users is missings";
          }
          const quantities = JSON.parse(order.quantity);

          const t = await Promise.all(
            quantities.map(async (item: { id: string; quantity: number }) => {
              const listing = await getListingById({ listingId: item.id });
              if (!listing) {
                return "no listing with that ID";
              }
              const listings = await prisma.listing.update({
                where: { id: item.id },
                data: {
                  stock: listing.stock - item.quantity,
                },
              });
              return listing
                ? `${item.quantity} ${listing.quantityType} of ${listing.title}`
                : "";
            })
          );

          const titles = t.filter(Boolean).join(", ");

          const newConversation: any = await prisma.conversation.create({
            data: {
              users: {
                connect: [{ id: pi.userId }, { id: order?.sellerId }],
              },
            },
            include: {
              users: true,
            },
          });
          const orderUpdate: any = await prisma.order.update({
            where: { id: order.id },
            data: { conversationId: newConversation.id, status: 1 },
          });

          const coopBody = `Hi ${
            seller.name
          }! I just ordered ${titles} from you and would like to pick them up at ${order.pickupDate.toLocaleTimeString()} on ${order.pickupDate.toLocaleDateString()}. Please let me know when my order is ready or if that time doesn't work.`;

          const producerBody = `Hi ${seller.name}! I just ordered ${titles} from you, please drop them off at ${buyer.location?.address} during my open `;

          if (seller.role === "COOP") {
            const newMessage: any = await prisma.message.create({
              include: {
                seen: true,
                sender: true,
              },
              data: {
                body: coopBody,
                messageOrder: "1",
                conversation: {
                  connect: { id: newConversation.id },
                },
                sender: {
                  connect: { id: pi.userId },
                },
                seen: {
                  connect: {
                    id: pi.userId,
                  },
                },
              },
            });
            if (seller.phoneNumber) {
              const params = {
                Message: `New order received! Buyer: ${
                  buyer.name
                }, Items: ${titles}, Pickup Date: ${order.pickupDate.toLocaleString()}`,
                PhoneNumber: seller.phoneNumber,
              };
              await sns.publish(params).promise();
            }
          }

          if (seller.role === "PRODUCER") {
            const newMessage: any = await prisma.message.create({
              include: {
                seen: true,
                sender: true,
              },
              data: {
                body: producerBody,

                messageOrder: "10",

                conversation: {
                  connect: { id: newConversation.id },
                },
                sender: {
                  connect: { id: pi.userId },
                },
                seen: {
                  connect: {
                    id: pi.userId,
                  },
                },
              },
            });
            if (seller.phoneNumber) {
              const params = {
                Message: `New order received! Buyer: ${buyer.name}, Items: ${titles}, Delivery Address: ${buyer.location?.address}`,
                PhoneNumber: seller.phoneNumber,
              };
              await sns.publish(params).promise();
            }
          }
        };
        postconversations();
      }

      break;

      switch (event.type) {
        case "checkout.session.expired":
      }
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
