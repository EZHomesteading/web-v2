import prisma from "@/lib/prismadb";
import { currentUser } from "@/lib/auth";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { FullChatData, ChatOrder, ChatUser, ChatMessage, ChatListing, OtherUserChat } from "chat-types";

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

    const otherUserId = conversation.participantIds.find(id => id !== user.id);
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

    const order: ChatOrder | null = await prisma.order.findFirst({
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
        purchaseLoc: true,
        listingIds: true,
        location: {
          select: { hours: true },
        },
      },
    });

    const listings: ChatListing[] = order?.listingIds
      ? await prisma.listing.findMany({
          where: { id: { in: order.listingIds } },
          select: {
            id: true,
            title: true,
            price: true,
            quantityType: true,
            imageSrc: true,
          },
        })
      : [];

    const chatMessages: ChatMessage[] = conversation.messages.map(message => ({
      ...message,
      seen: !!message.seen,
    }));

    // Consolidate data for the frontend
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
        email: user.email,
        url: user.url,
        location: user.location ?? null,
      } as ChatUser,
      otherUser,
      order,
      listings,
      messages: chatMessages,
    };

    return result;
  } catch (error: any) {
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2023") {
      console.error("Invalid conversationId:", conversationId);
      return null;
    }
    console.error("SERVER_ERROR", error);
    return null;
  }
};

export { getFullChatData };
