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
  Prisma,
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
      throw new Error("No order provided");
    }

    const seller = newOrder.seller;
    const buyer = newOrder.buyer;

    if (!seller || !buyer) {
      console.log("Missing seller or buyer:", {
        seller: !!seller,
        buyer: !!buyer,
      });
      throw new Error("Missing seller or buyer");
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

    // Create conversation first so we have the ID for all subsequent operations
    console.log("Creating conversation between:", buyer.id, "and", seller.id);
    const newConversation = await prisma.conversation.create({
      data: {
        participantIds: [buyer.id, seller.id],
      },
    });

    if (!newConversation) {
      throw new Error("Failed to create conversation");
    }

    console.log("Created conversation:", newConversation.id);

    // Update order with conversation ID
    console.log("Updating order with conversation ID");
    await prisma.order.update({
      where: { id: newOrder.id },
      data: {
        conversationId: newConversation.id,
        status: "BUYER_PROPOSED_TIME",
      },
    });

    // Handle email notifications
    if (seller.notifications?.includes("EMAIL_NEW_ORDERS")) {
      try {
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

        await sesClient.send(new SendEmailCommand(emailParams));
        console.log("Email sent to the seller");
      } catch (error) {
        console.error("Error sending email to the seller:", error);
        // Don't throw here - continue even if email fails
      }
    }

    // Handle message creation and push notifications based on type
    const messageBody =
      type === "DELIVERY"
        ? `Hi ${
            seller.name
          }! I would like to order ${titles} from you, can they be dropped off  at ${
            newOrder.location &&
            `${newOrder.location?.address[0]}, ${newOrder.location?.address[1]}, ${newOrder.location?.address[2]}. ${newOrder.location?.address[3]}`
          } sometime around ${newOrder.pickupDate.toLocaleTimeString()} on ${newOrder.pickupDate.toLocaleDateString()} . Please let me know if that time works for you.`
        : `Hi ${
            seller.name
          }! I would like to order ${titles} from you and would like to pick them up from you sometime around ${newOrder.pickupDate.toLocaleDateString()}  on ${newOrder.pickupDate.toLocaleDateString()}. Please let me know if that time works for you.`;

    // Create message
    await prisma.message.create({
      data: {
        body: messageBody,
        messageOrder: "BUYER_PROPOSED_TIME",
        conversationId: newConversation.id,
        senderId: buyer.id,
      },
    });

    // Handle push notifications
    if (seller.subscriptions) {
      try {
        const formatrecipients = JSON.parse(seller.subscriptions);
        const send = formatrecipients.map((subscription: PushSubscription) =>
          webPush.sendNotification(
            subscription,
            JSON.stringify({
              title: "You have a new order!",
              body: messageBody,
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
        console.error("Push notification error:", error);
        // Don't throw here - continue even if push notification fails
      }
    }

    // Always return the conversation ID at the end
    return newConversation.id;
  } catch (error) {
    console.error("Error in postconversations:", error);
    throw error; // Re-throw to handle in the caller
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

    console.log("Creating new order");
    // First create the order
    console.log("USERID", user.id);
    const orderData = await prisma.order.create({
      data: {
        userId: user.id,
        sellerId,
        pickupDate,
        quantity,
        totalPrice,
        fulfillmentType: type as any,
        status,
        preferredLocationId,
      },
    });

    // Then fetch it with all relations
    const newOrder = (await prisma.order.findUnique({
      where: {
        id: orderData.id,
      },
      include: {
        seller: true,
        buyer: true,
        location: true,
      },
    })) as OrderWithRelations;

    if (!newOrder) {
      throw new Error("Failed to create order");
    }
    console.log("Order created:", newOrder);

    await prisma.basketItem.deleteMany({
      where: { basketId: itemId },
    });
    await prisma.basket.deleteMany({
      where: { id: itemId },
    });

    const postResp = await postconversations(newOrder, type);
    console.log("POOOOOOOOST", postResp);
    return NextResponse.json({
      message: "Order created successfully",
      orderId: newOrder.id,
      conversationId: postResp,
    });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return new NextResponse("Error", { status: 500 });
  }
}
