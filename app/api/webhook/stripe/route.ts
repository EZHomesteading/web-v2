// stripe webhook, for handling any extra action whenever a specific even happens via stripe.
import prisma from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getUserById } from "@/actions/getUser";
import { getOrderById } from "@/actions/getOrder";
//import { getListingById } from "@/actions/getListings";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { UserRole } from "@prisma/client";
import webPush, { PushSubscription } from "web-push";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});
import { basketStatus } from "@prisma/client";
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
      const pi = event.data.object.metadata;
      const buyerId = pi.userId;

      const PID = event.data.object.id;

      console.log(pi, buyerId, PID);
      const baskets = await prisma.basket.findMany({
        where: {
          userId: buyerId,
          status: basketStatus.ACTIVE,
        },
        select: {
          id: true,
          proposedLoc: true,
          pickupDate: true,
          deliveryDate: true,
          orderMethod: true,
          items: {
            select: {
              quantity: true,
              price: true,
              listing: {
                select: {
                  id: true,
                  title: true,
                  quantityType: true,
                  stock: true,
                  price: true,
                  subCategory: true,
                  minOrder: true,
                },
              },
            },
          },
          location: {
            select: {
              id: true,
              user: {
                select: {
                  id: true,
                  url: true,
                  name: true,
                  role: true,
                },
              },
            },
          },
        },
      });
      console.log(baskets);

      const createdOrders = [] as any;
      for (const basket of baskets) {
        try {
          const totalPriceArr = basket.items.map(
            (item: any) => item.quantity * item.price
          );
          const totalPrice = totalPriceArr.reduce(
            (accumulator, currentValue) => accumulator + currentValue,
            0
          );

          const newOrder = await prisma.order.create({
            data: {
              userId: buyerId,
              locationId: basket.location.id,
              proposedLoc: basket.proposedLoc,
              paymentIntentId: PID,
              sellerId: basket.location.user.id,
              pickupDate: basket.pickupDate
                ? new Date(basket.pickupDate)
                : null,
              items: basket.items,
              totalPrice,
              status: "BUYER_PROPOSED_TIME",
              fulfillmentType: basket.orderMethod,
              fee: { site: totalPrice * 0.06 },
            },
            include: {
              buyer: true,
              seller: true,
            },
          });
          createdOrders.push(newOrder);

          // Process items
          basket.items.map(async (item: any) => {
            const listing = await prisma.listing.update({
              where: { id: item.listing.id },
              data: { stock: item.listing.stock - item.quantity },
            });
          });

          // Update basket status
          const updatedBasket = await prisma.basket.delete({
            where: { id: basket.id },
          });
          console.log(updatedBasket);
        } catch (error) {
          console.error("Error processing basket:", error);
          return NextResponse.json(
            { error: "Failed to process basket" },
            { status: 500 }
          );
        }
        // Loop through each order in the payment
        for (const order of createdOrders) {
          const postconversations = async () => {
            // Fetch order details

            // Fetch buyer and seller details
            const seller = order.seller;
            const buyer = order.buyer;

            if (!seller || !buyer) {
              return "one of users is missings";
            }
            // Update listing stock based on the purchased quantities, and parse out quantities from the array on the order object.
            const items = order.items;
            const t = await Promise.all(
              items.map(async (item: any) => {
                const listing = item.listing;
                if (!listing) {
                  return "no listing with that ID";
                }

                return listing
                  ? `${item.quantity} ${listing.quantityType} of ${listing.title}`
                  : "";
              })
            );

            const titles = t.filter(Boolean).join(", ");
            // Create a new conversation between buyer and seller
            const newConversation = await prisma.conversation.create({
              data: {
                participantIds: [buyer.id, seller.id],
              },
            });

            if (!newConversation) {
              throw new Error("Failed to create conversation");
            }
            // Update the order with the new conversation ID and status
            const orderUpdate = await prisma.order.update({
              where: { id: order.id },
              data: {
                conversationId: newConversation.id,
              },
            });

            // Prepare message bodies for buyer and seller
            const coopBody = `Hi ${
              seller.name
            }! I just ordered ${titles} from you and would like to pick them up at ${order.pickupDate.toLocaleTimeString()} on ${order.pickupDate.toLocaleDateString()}. Please let me know when my order is ready or if that time doesn't work.`;
            const producerBody = `Hi ${
              seller.name
            }! I just ordered ${titles} from you, please drop them off at ${
              buyer.location && buyer.location[0]
                ? `${buyer.location[0]?.address[0]}, ${buyer.location[0]?.address[1]}, ${buyer.location[0]?.address[2]}. ${buyer.location[0]?.address[3]}`
                : buyer.location && buyer.location[1]
                ? `${buyer.location[1]?.address[0]}, ${buyer.location[1]?.address[1]}, ${buyer.location[1]?.address[2]}. ${buyer.location[1]?.address[3]}`
                : buyer.location && buyer.location[2]
                ? `${buyer.location[2]?.address[2]}, ${buyer.location[2]?.address[1]}, ${buyer.location[2]?.address[2]}. ${buyer.location[2]?.address[3]}`
                : "this user has no locations set"
            } during my open hours. My hours can be viewed in More Options.`;
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
            if (order.fulfillmentType === "PICKUP") {
              const newMessage = await prisma.message.create({
                include: {
                  sender: true,
                },
                data: {
                  body: coopBody,
                  messageOrder: "BUYER_PROPOSED_TIME",
                  conversation: {
                    connect: { id: newConversation.id },
                  },
                  sender: {
                    connect: { id: pi.userId },
                  },
                },
              });

              try {
                if (!seller.subscriptions) {
                  console.error("A users Push subscription has expired.");
                  return;
                }
                const formatrecipients = JSON.parse(seller.subscriptions);
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
                          privateKey: process.env
                            .WEB_PUSH_PRIVATE_KEY as string,
                        },
                      }
                    )
                );
                await Promise.all(send);
              } catch (error) {
                console.error("A users Push subscription has expired.");
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

            if (order.fulfillmentType === "DELIVERY") {
              const orderUpdate = await prisma.order.update({
                where: { id: order.id },
                data: {
                  location:
                    buyer.location && buyer.location[0]
                      ? buyer.location[0]
                      : buyer.location && buyer.location[1]
                      ? buyer.location[1]
                      : buyer.location && buyer.location[2]
                      ? buyer.location[2]
                      : order.location,
                },
              });
              const newMessage = await prisma.message.create({
                include: {
                  sender: true,
                },
                data: {
                  body: producerBody,
                  messageOrder: "BUYER_PROPOSED_TIME",
                  conversation: {
                    connect: { id: newConversation.id },
                  },
                  sender: {
                    connect: { id: pi.userId },
                  },
                },
              });
              try {
                if (!seller.subscriptions) {
                  console.error("A users Push subscription has expired.");
                  return;
                }
                const formatrecipients = JSON.parse(seller.subscriptions);
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
                          privateKey: process.env
                            .WEB_PUSH_PRIVATE_KEY as string,
                        },
                      }
                    )
                );
                await Promise.all(send);
              } catch (error) {
                console.error("A users Push subscription has expired.");
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

        console.log(createdOrders);

        //(done) orders from buyers existing basket
        //delete previous basket or set it to inactive.(done)
        //remove stock from listings(done)
        //send messages and emails to all relevant users with information
      }

      return NextResponse.json({ received: true }, { status: 200 });
  }
}
