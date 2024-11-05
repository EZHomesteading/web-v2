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
} from "chat-types";
import { ListingQuantities } from "@prisma/client";

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
        conversationId: true,
        paymentIntentId: true,
        quantity: true,
        status: true,
        location: {
          select: { hours: true, address: true },
        },
      },
    });

    const transformedOrder: ChatOrder | null = order
      ? {
          id: order.id,
          sellerId: order.sellerId,
          userId: order.userId,
          pickupDate: order.pickupDate,
          totalPrice: order.totalPrice,
          conversationId: order.conversationId,
          paymentIntentId: order.paymentIntentId,
          quantity: order.quantity as ListingQuantities[],
          status: order.status,
          location: order.location,
        }
      : null;

    // Extract listing IDs from the quantity array
    const listingIds = order?.quantity?.map((item) => item.id) ?? [];

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
        phoneNumber: user.phoneNumber,
        email: user.email,
        url: user.url,
        location: user.location ?? null,
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
