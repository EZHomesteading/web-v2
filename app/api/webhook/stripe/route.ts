// stripe webhook, for handling any extra action whenever a specific even happens via stripe.
import prisma from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getUserById } from "@/actions/getUser";
import { getOrderById } from "@/actions/getOrder";
import { getListingById } from "@/actions/getListings";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { UserRole } from "@prisma/client";
import webPush, { PushSubscription } from "web-push";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
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
      // Extract relevant data from the Stripe event
      const pi = event.data.object.metadata as any;
      const buyerId = pi.userId;
      const a = pi.orderIds;
      const b = a.replace(/,(?=[^,]*$)/, "");
      const orderIds = JSON.parse(b);

      await prisma.cart.deleteMany({
        where: { userId: pi.userId },
      });
      // Loop through each order in the payment
      for (const orderId of orderIds) {
        const postconversations = async () => {
          // Fetch order details
          const order = await getOrderById({ orderId });
          if (!order) {
            return;
          }
          // Fetch buyer and seller details
          const seller = await getUserById({ userId: order.sellerId });
          const buyer = await getUserById({ userId: buyerId });

          if (!seller || !buyer) {
            return "one of users is missings";
          }
          // Update listing stock based on the purchased quantities, and parse out quantities from the array on the order object.
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
          // Create a new conversation between buyer and seller
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
          // Update the order with the new conversation ID and status
          const orderUpdate: any = await prisma.order.update({
            where: { id: order.id },
            data: { conversationId: newConversation.id, status: 1 },
          });

          // Prepare message bodies for buyer and seller
          const coopBody = `Hi ${
            seller.name
          }! I just ordered ${titles} from you and would like to pick them up at ${order.pickupDate.toLocaleTimeString()} on ${order.pickupDate.toLocaleDateString()}. Please let me know when my order is ready or if that time doesn't work.`;
          const producerBody = `Hi ${seller.name}! I just ordered ${titles} from you, please drop them off at ${buyer.location?.address} during my open `;
          // Send email notification to the seller if enabled
          if (seller.notifications.includes("EMAIL_NEW_ORDERS")) {
            // Prepare email parameters
            const emailParams = {
              Destination: {
                ToAddresses: [seller.email || "shortzach396@gmail.com"],
              },
              Message: {
                Body: {
                  Html: {
                    Data: ` 
                    <div style="width: 100%; display: flex; font-family: 'Outfit', sans-serif; color: white; box-sizing: border-box;">
                      <div style="display: flex; flex-direction: column; background-color: #ced9bb; padding: 16px; border-radius: 8px; width: 100%; max-width: 320px; box-sizing: border-box;">
                        <header style="font-size: 24px; display: flex; flex-direction: row; align-items: center; margin-bottom: 16px; width: 100%;">
                          <img src="https://i.ibb.co/TB7dMtk/ezh-logo-no-text.png" alt="EZHomesteading Logo" width="50" height="50" style="margin-right: 8px;" />
                          <span>EZHomesteading</span>
                        </header>
                        <h1 style="font-size: 20px; margin-bottom: 8px;">Hi, ${
                          seller.name
                        }</h1>
                        <p style="font-size: 14px; margin-bottom: 16px;">You have a new order from ${
                          buyer.name
                        }</p>

                          <p style="font-size: 18px; margin-bottom: 8px;">Order Details:</p>
                          <div style="margin-bottom: 8px;">
                            <p style="font-size: 16px; margin-bottom: 4px;">Items:</p>
                            <ul style="font-size: 14px;">
                              ${titles
                                .split(", ")
                                .map((item) => `<li>${item}</li>`)
                                .join("")}
                            </ul>
                          </div>
                          <div style="margin-bottom: 8px;">
                            <p style="font-size: 16px; margin-bottom: 4px;">Pickup Date:</p>
                            <p style="font-size: 14px;">${order.pickupDate.toLocaleString()}</p>
                          </div>
                          <div>
                            <p style="font-size: 16px; margin-bottom: 4px;">Order Total:</p>
                            <p style="font-size: 14px;">$${order.totalPrice.toFixed(
                              2
                            )}</p>
                          </div>

                        <a href="https://ezhomesteading.com/chat/${
                          newConversation.id
                        }" style="text-decoration: none; margin-bottom: 8px; width: 100%;">
                          <button style="background-color: #64748b; border-radius: 9999px; padding: 8px 16px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); color: #ffffff; width: 100%; text-align: center;">
                            Go to conversation
                          </button>
                        </a>
                        <a href="https://ezhomesteading.com/dashboard/orders/seller" style="text-decoration: none; width: 100%;">
                          <button style="background-color: #64748b; border-radius: 9999px; padding: 8px 16px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); color: #ffffff; width: 100%; text-align: center;">
                            Go to sell orders
                          </button>
                        </a>
                      </div>
                    </div>
                    `,
                  },
                },
                Subject: {
                  Data: "New Order Received",
                },
              },
              Source: "disputes@ezhomesteading.com",
            };

            try {
              await sesClient.send(new SendEmailCommand(emailParams));
              console.log("Email sent to the seller");
            } catch (error) {
              console.error("Error sending email to the seller:", error);
            }
          }
          // Create a new message in the conversation based on the seller's role
          if (seller.role === UserRole.COOP) {
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

            try {
              if (!seller.subscriptions) {
                console.log("A users Push subscription has expired.");
                return;
              }
              const formatrecipients = JSON.parse(seller.subscriptions);
              console.log(formatrecipients);
              const send = formatrecipients.map(
                (subscription: PushSubscription) =>
                  webPush.sendNotification(
                    subscription,
                    JSON.stringify({
                      title: "You have a new order!",
                      body: coopBody,
                      id: newConversation.id,
                    }),
                    {
                      vapidDetails: {
                        subject: "mailto:ezhomesteading@gmail.com",
                        publicKey: process.env
                          .NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY as string,
                        privateKey: process.env.WEB_PUSH_PRIVATE_KEY as string,
                      },
                    }
                  )
              );
              await Promise.all(send);
            } catch (error) {
              console.log("A users Push subscription has expired.");
            }

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

          if (seller.role === UserRole.PRODUCER) {
            const newMessage = await prisma.message.create({
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
            try {
              if (!seller.subscriptions) {
                console.log("A users Push subscription has expired.");
                return;
              }
              const formatrecipients = JSON.parse(seller.subscriptions);
              console.log(formatrecipients);
              const send = formatrecipients.map(
                (subscription: PushSubscription) =>
                  webPush.sendNotification(
                    subscription,
                    JSON.stringify({
                      title: "You have a new order!",
                      body: producerBody,
                      id: newConversation.id,
                    }),
                    {
                      vapidDetails: {
                        subject: "mailto:ezhomesteading@gmail.com",
                        publicKey: process.env
                          .NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY as string,
                        privateKey: process.env.WEB_PUSH_PRIVATE_KEY as string,
                      },
                    }
                  )
              );
              await Promise.all(send);
            } catch (error) {
              console.log("A users Push subscription has expired.");
            }
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
