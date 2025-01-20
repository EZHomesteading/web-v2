import prisma from "@/lib/prismadb";
import { currentUser } from "@/lib/auth";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import type {
  FullChatData,
  ChatOrder,
  ChatUser,
  ChatMessage,
  ChatListing,
  OtherUserChat,
  Location,
} from "chat-types";
interface OrderItem {
  listing: {
    id: string;
  };
}
const extractListingIds = (items: any): string[] => {
  try {
    // If items is a string, try to parse it
    const parsedItems = typeof items === "string" ? JSON.parse(items) : items;

    // Check if parsedItems is an array
    if (!Array.isArray(parsedItems)) {
      return [];
    }

    return parsedItems
      .map((item: OrderItem) => item?.listing?.id)
      .filter((id): id is string => Boolean(id));
  } catch (e) {
    console.error("Error parsing items:", e);
    return [];
  }
};
const getFullChatData = async (
  conversationId: string
): Promise<FullChatData | null> => {
  try {
    const user = await currentUser();
    if (!user) {
      return null;
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                role: true,
                image: true,
                url: true,
                email: true,
                stripeAccountId: true,
              },
            },
          },
        },
      },
    });
    if (!conversation) {
      return null;
    }

    const otherUserId = conversation.participantIds.find(
      (id) => id !== user.id
    );

    if (!otherUserId) {
      return null;
    }

    const otherUser: OtherUserChat | null = await prisma.user.findUnique({
      where: { id: otherUserId },
      select: {
        id: true,
        name: true,
        role: true,
        image: true,
        url: true,
        email: true,
        stripeAccountId: true,
      },
    });

    const order = await prisma.order.findFirst({
      where: {
        conversationId,
      },
      select: {
        id: true,
        sellerId: true,
        userId: true,
        pickupDate: true,
        totalPrice: true,
        fulfillmentType: true,
        locationId: true,
        conversationId: true,
        paymentIntentId: true,
        proposedLoc: true,
        fee: true,
        items: true,
        status: true,
        preferredLocationId: true,
      },
    });

    let location: Location | null = null;
    if (!order?.proposedLoc) {
      if (order?.preferredLocationId) {
        const locationData = await prisma.location.findUnique({
          where: {
            id: order.preferredLocationId,
          },
          select: {
            id: true,
            userId: true,
            displayName: true,
            type: true,
            coordinates: true,
            address: true,
            role: true,
            SODT: true,
            bio: true,
            isDefault: true,
            showPreciseLocation: true,
            createdAt: true,
            updatedAt: true,
            hours: true,
          },
        });

        if (locationData) {
          location = locationData as Location;
        }
      } else if (order?.locationId) {
        const locationData = await prisma.location.findUnique({
          where: {
            id: order.locationId,
          },
          select: {
            id: true,
            userId: true,
            displayName: true,
            type: true,
            coordinates: true,
            address: true,
            role: true,
            SODT: true,
            bio: true,
            isDefault: true,
            showPreciseLocation: true,
            createdAt: true,
            updatedAt: true,
            hours: true,
          },
        });

        if (locationData) {
          location = locationData as Location;
        }
      }
    } else {
      location = order.proposedLoc as Location;
    }

    const transformedOrder: ChatOrder | null = order
      ? {
          id: order.id,
          sellerId: order.sellerId,
          userId: order.userId,
          fulfillmentType: order.fulfillmentType,
          pickupDate: order.pickupDate,
          fee: order.fee,
          totalPrice: order.totalPrice,
          conversationId: order.conversationId,
          paymentIntentId: order.paymentIntentId,
          items: Array.isArray(order.items) ? order.items : [],
          status: order.status,
          location: location as Location,
        }
      : null;

    // Extract listing IDs from the quantity array
    const listingIds = extractListingIds(order?.items);

    const listings: ChatListing[] =
      listingIds.length > 0
        ? await prisma.listing.findMany({
            where: { id: { in: listingIds } },
            select: {
              id: true,
              title: true,
              price: true,
              quantityType: true,
              imageSrc: true,
            },
          })
        : [];

    const chatMessages: ChatMessage[] = conversation.messages.map(
      (message) => ({
        ...message,
        seen: !!message.seen,
      })
    );

    const result: FullChatData = {
      conversation: {
        id: conversation.id,
        participantIds: conversation.participantIds,
        messages: chatMessages,
      },
      currentUser: {
        id: user.id,
        name: user.name,
        role: user.role,
        phoneNumber: user.phoneNumber || undefined,
        email: user.email,
        url: user.url || undefined,
        location: null, // Add this if it's required by your ChatUser type
      } as ChatUser,
      otherUser,
      order: transformedOrder,
      listings,
      messages: chatMessages,
    };

    return result;
  } catch (error: any) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2023"
    ) {
      console.error("Invalid conversationId:", conversationId);
      return null;
    }
    console.error("SERVER_ERROR", error);
    return null;
  }
};

export { getFullChatData };
