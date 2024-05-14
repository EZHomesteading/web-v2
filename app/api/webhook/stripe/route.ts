import prisma from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import getUserById from "@/actions/user/getUserById";
import getOrderById from "@/actions/getOrderById";
import getListingById from "@/actions/listing/getListingById";
import AWS from "@/aws-config";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
const sns = new AWS.SNS();
const sesClient = new SESClient({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

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
              await prisma.listing.update({
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
          console.log("seller notifs", seller.notifications);
          if (seller.notifications.includes("EMAIL_NEW_ORDERS")) {
            const emailParams = {
              Destination: {
                ToAddresses: [seller.email || "shortzach396@gmail.com"],
              },
              Message: {
                Body: {
                  Html: {
                    Data: ` 
                  <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-family: 'Outfit', sans-serif;">
                    <div style="display: flex; flex-direction: column; justify-content: flex-start; align-items: stretch; background-color: #ced9bb; padding: 8px; border-radius: 8px; width: 320px; aspect-ratio: 9/16;">
                      <header style="font-size: 24px; display: flex; flex-direction: row; align-items: center;">
                        <img src="path/to/ezh-logo-no-text.png" alt="EZHomesteading Logo" width="50" height="50" />
                        EZHomesteading
                      </header>
                      <h1>Hi, ${seller.name}</h1>
                      <p style="font-size: 12px;">You have a new order from ${
                        buyer.name
                      }</p>
                      <p style="font-size: 24px;">Order Details:</p>
                      <ul style="display: grid; grid-template-columns: repeat(2, 1fr); font-size: 20px; margin-bottom: 4px; border-top: 1px solid; border-bottom: 1px solid; padding-top: 8px; padding-bottom: 8px;">
                        Items
                        <div style="font-size: 14px; text-align: start;">
                          ${titles
                            .split(", ")
                            .map((item) => `<li>${item}</li>`)
                            .join("")}
                        </div>
                      </ul>
                      <ul style="display: grid; grid-template-columns: repeat(2, 1fr); font-size: 20px; border-bottom: 1px solid; align-items: center; padding-top: 8px; padding-bottom: 8px;">
                        Pickup Date
                        <div>
                          <li style="font-size: 14px;">${order.pickupDate.toLocaleString()}</li>
                        </div>
                      </ul>
                      <ul style="display: grid; grid-template-columns: repeat(2, 1fr); font-size: 20px; border-bottom: 1px solid; align-items: center; padding-top: 8px; padding-bottom: 8px;">
                        Order Total
                        <div>
                          <li style="font-size: 14px;">$${order.totalPrice.toFixed(
                            2
                          )}</li>
                        </div>
                      </ul>
                      <a href="https://ezhomesteading.com/chat/${
                        newConversation.id
                      }" style="text-decoration: none;">
                        <button style="background-color: #64748b; border-radius: 9999px; padding-top: 8px; padding-bottom: 8px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); color: #ffffff; padding-left: 8px; padding-right: 8px; margin-top: 8px;">
                          Go to conversation
                        </button>
                      </a>
                      <a href="https://ezhomesteading.com/dashboard/orders/seller" style="text-decoration: none;">
                        <button style="background-color: #64748b; border-radius: 9999px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); color: #ffffff; padding-top: 8px; padding-bottom: 8px; padding-left: 8px; padding-right: 8px; margin-top: 8px;">
                          Go to sell orders
                        </button>
                      </a>
                    </div>
                  </div>`,
                  },
                },
                Subject: {
                  Data: "New Order Received",
                },
              },
              Source: "no-reply@ezhomesteading.com",
            };

            try {
              await sesClient.send(new SendEmailCommand(emailParams));
              console.log("Email sent to the seller");
            } catch (error) {
              console.error("Error sending email to the seller:", error);
            }
          }
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
            // if (seller.phoneNumber) {
            //   const params = {
            //     Message: `New order received! Buyer: ${
            //       buyer.name
            //     }, Items: ${titles}, Pickup Date: ${order.pickupDate.toLocaleString()}`,
            //     PhoneNumber: seller.phoneNumber,
            //   };
            //   await sns.publish(params).promise();
            // }
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
            // if (seller.phoneNumber) {
            //   const params = {
            //     Message: `New order received! Buyer: ${buyer.name}, Items: ${titles}, Delivery Address: ${buyer.location?.address}`,
            //     PhoneNumber: seller.phoneNumber,
            //   };
            //   await sns.publish(params).promise();
            // }
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
