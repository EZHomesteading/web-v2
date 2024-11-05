import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { getListingById } from "@/actions/getListings";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import {
  ListingQuantities,
  Order,
  Notification,
  UserRole,
  Location,
  User,
} from "@prisma/client";
import webPush, { PushSubscription } from "web-push";
import { currentUser } from "@/lib/auth";

type OrderWithRelations = Order & {
  seller: User;
  buyer: User;
  location: Location;
};

const sesClient = new SESClient({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

const postconversations = async (
  newOrder: OrderWithRelations,
  type: string
) => {
  try {
    console.log("Starting postconversations with order:", newOrder.id);

    if (!newOrder) {
      console.log("No order provided");
      return;
    }

    const seller = newOrder.seller;
    const buyer = newOrder.buyer;

    if (!seller || !buyer) {
      console.log("Missing seller or buyer:", {
        seller: !!seller,
        buyer: !!buyer,
      });
      return "one of users is missing";
    }

    console.log("Processing quantities:", newOrder.quantity);
    const quantities = newOrder.quantity;
    const t = await Promise.all(
      quantities.map(async (item: ListingQuantities) => {
        console.log("Processing item:", item.id);
        const listing = await getListingById({ listingId: item.id });
        if (!listing) {
          console.log("No listing found for ID:", item.id);
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
    console.log("Generated titles:", titles);

    console.log("Creating conversation between:", buyer.id, "and", seller.id);
    const newConversation = await prisma.conversation.create({
      data: {
        participantIds: [buyer.id, seller.id],
      },
    });
    console.log("Created conversation:", newConversation.id);

    console.log("Updating order with conversation ID");
    await prisma.order.update({
      where: { id: newOrder.id },
      data: {
        conversationId: newConversation.id,
        status: "BUYER_PROPOSED_TIME",
      },
    });

    if (seller.notifications.includes("EMAIL_NEW_ORDERS")) {
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
                      <p style="font-size: 14px;">${newOrder.pickupDate.toLocaleString()}</p>
                    </div>
                    <div>
                      <p style="font-size: 16px; margin-bottom: 4px;">Order Total:</p>
                      <p style="font-size: 14px;">$${newOrder.totalPrice.toFixed(
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

    if (type === "delivery") {
      console.log("Creating delivery message");
      const deliveryBody = `Hi ${
        seller.name
      }! I just ordered ${titles} from you, please drop them off at ${
        newOrder.location &&
        `${newOrder.location?.address[0]}, ${newOrder.location?.address[1]}, ${newOrder.location?.address[2]}. ${newOrder.location?.address[3]}`
      } during my open hours. My hours can be viewed in More Options.`;

      await prisma.message.create({
        data: {
          body: deliveryBody,
          messageOrder: "1",
          conversationId: newConversation.id,
          senderId: buyer.id,
        },
      });

      try {
        if (!seller.subscriptions) {
          console.error("A users Push subscription has expired.");
          return;
        }
        const formatrecipients = JSON.parse(seller.subscriptions);
        const send = formatrecipients.map((subscription: PushSubscription) =>
          webPush.sendNotification(
            subscription,
            JSON.stringify({
              title: "You have a new order!",
              body: deliveryBody,
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
        console.error("A users Push subscription has expired.");
      }
    }

    if (type === "pickup") {
      console.log("Creating pickup message");
      const pickupBody = `Hi ${
        seller.name
      }! I just ordered ${titles} from you and would like to pick them up at ${newOrder.pickupDate.toLocaleTimeString()} on ${newOrder.pickupDate.toLocaleDateString()}. Please let me know when my order is ready or if that time doesn't work.`;

      await prisma.message.create({
        data: {
          body: pickupBody,
          messageOrder: "10",
          conversationId: newConversation.id,
          senderId: buyer.id,
        },
      });

      try {
        if (!seller.subscriptions) {
          console.error("A users Push subscription has expired.");
          return;
        }
        const formatrecipients = JSON.parse(seller.subscriptions);
        const send = formatrecipients.map((subscription: PushSubscription) =>
          webPush.sendNotification(
            subscription,
            JSON.stringify({
              title: "You have a new order!",
              body: pickupBody,
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
        console.error("A users Push subscription has expired.");
      }
    }
  } catch (error) {
    console.error("Error in postconversations:", error);
    throw error;
  }
};

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const data = await request.json();
    console.log("Received request data:", data);

    const { itemId, order, sellerId, type } = data;
    const { pickupDate, quantity, totalPrice, status, preferredLocationId } =
      order;

    if (!itemId) {
      return new NextResponse("Item ID is required", { status: 400 });
    }
    if (!sellerId) {
      return new NextResponse("seller ID is required", { status: 400 });
    }
    if (!order) {
      return new NextResponse("order info is required", { status: 400 });
    }
    if (!preferredLocationId) {
      return new NextResponse("locationId is required", { status: 400 });
    }
    if (!type) {
      return new NextResponse("fullfilment type is required", { status: 400 });
    }

    await prisma.wishlistItem.deleteMany({
      where: { wishlistGroupId: itemId },
    });
    await prisma.wishlistGroup.deleteMany({
      where: { id: itemId },
    });

    console.log("Creating new order");
    const newOrder = (await prisma.order.create({
      data: {
        userId: user.id,
        sellerId,
        pickupDate,
        quantity,
        totalPrice,
        status,
        locationId: preferredLocationId,
      },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,

            phoneNumber: true,

            notifications: true,

            subscriptions: true,
          },
        },
        buyer: {
          select: {
            id: true,
          },
        },
        location: true,
      },
    })) as OrderWithRelations;

    console.log("Order created:", newOrder);
    await postconversations(newOrder, type);

    return NextResponse.json({
      message: "Order created successfully",
      orderId: newOrder.id,
    });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return new NextResponse("Error", { status: 500 });
  }
}
