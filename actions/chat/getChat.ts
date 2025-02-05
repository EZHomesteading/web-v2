import prisma from "@/lib/prismadb";
import { currentUser } from "@/lib/auth";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const getConversationById = async (conversationId: string) => {
  try {
    const user = await currentUser();
    if (!user) {
      return null;
    }

    // get conversation and all its messages, including sender details for each message
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

    const otherUser = await prisma.user.findUnique({
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

    return {
      ...conversation,
      currentUser: {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email,
        url: user.url,
      },
      otherUser: otherUser,
    };
  } catch (error: any) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2023"
    ) {
      console.error("Invalid conversationId:", conversationId);
      return null;
    }
    console.error(error, "SERVER_ERROR");
    return null;
  }
};

const GetOrderChat = async (conversationId: string) => {
  try {
    if (!conversationId) {
      return null;
    }

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
        items: true,
        status: true,
        location: {
          select: { hours: true },
        },
      },
    });

    return { order };
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  }
};
const getConversations = async () => {
  const user = await currentUser();

  if (!user?.id) {
    return { conversations: [], user: null };
  }

  try {
    // get all conversations where user is a participant
    const conversations = await prisma.conversation.findMany({
      orderBy: {
        lastMessageAt: "desc", // newest conversations first
      },
      where: {
        participantIds: {
          has: user.id, // array contains current user's id
        },
      },
      include: {
        messages: {
          include: {
            sender: true, // include message sender details
          },
        },
      },
    });

    // add other participant's details to each conversation
    const conversationsWithUsers = await Promise.all(
      conversations.map(async (conversation) => {
        const otherUserId = conversation.participantIds.find(
          (id) => id !== user.id
        );
        const otherUser = otherUserId
          ? await prisma.user.findUnique({
              where: { id: otherUserId },
            })
          : null;

        return {
          ...conversation,
          users: otherUser ? [user, otherUser] : [user], // maintain old format expecting users array
        };
      })
    );

    return { conversations: conversationsWithUsers, user };
  } catch (error: any) {
    return { conversations: [], user: null };
  }
};

const getMessages = async (conversationId: string) => {
  try {
    // get all messages for a conversation
    const messages = await prisma.message.findMany({
      where: {
        conversationId: conversationId,
      },
      include: {
        sender: true, // include message sender details
      },
      orderBy: {
        createdAt: "asc", // oldest messages first
      },
    });

    // transform to maintain old format but with boolean seen status
    const transformedMessages = messages.map((message) => ({
      ...message,
      seen: message.seen, // seen is now a boolean instead of relation
    }));

    return transformedMessages;
  } catch (error: any) {
    return [];
  }
};

export { getConversations, getConversationById, getMessages, GetOrderChat };
