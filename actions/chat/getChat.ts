// get conversation based on current user
import prisma from "@/lib/prismadb";
import { currentUser } from "@/lib/auth";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const getConversationById = async (conversationId: string) => {
  try {
    const user = await currentUser();
    if (!user) {
      return null;
    }

    // Fetch the conversation from the database using the provided conversationId
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            role: true,
            image: true,
            url: true,
            //hours: true,
            email: true,
            stripeAccountId: true,
          },
        },
      },
    });

    if (!conversation) {
      // If no conversation is found, return null
      return null;
    }

    // Find the other user in the conversation (the one who is not the current user)
    const otherUser = conversation.users.find((u) => u.id !== user.id);

    // Return the conversation with additional data for the current user and the other user
    return {
      ...conversation,
      currentUser: {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email,
        //hours: user.hours,
        location: user.location,
      },
      otherUser: otherUser
        ? {
            id: otherUser.id,
            name: otherUser.name,
            role: otherUser.role,
            image: otherUser.image,
            email: otherUser.email,
            //hours: otherUser.hours,
            stripeAccountId: otherUser.stripeAccountId,
          }
        : null,
    };
  } catch (error: any) {
    // Handle specific Prisma error: P2023 (Invalid input data)
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2023"
    ) {
      console.log("Invalid conversationId:", conversationId);
      return null;
    }
    // Log any other error and return null
    console.log(error, "SERVER_ERROR");
    return null;
  }
};

const getConversations = async () => {
  const user = await currentUser();

  if (!user?.id) {
    return { conversations: [], user: null };
  }

  try {
    const conversations = await prisma.conversation.findMany({
      orderBy: {
        lastMessageAt: "desc",
      },
      where: {
        userIds: {
          has: user.id,
        },
        NOT: {
          id: user?.id,
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            sender: true,
            seen: true,
          },
        },
      },
    });

    return { conversations, user };
  } catch (error: any) {
    return { conversations: [], user: null };
  }
};
const getMessages = async (conversationId: string) => {
  try {
    const messages = await prisma.message.findMany({
      where: {
        conversationId: conversationId,
      },
      include: {
        sender: true,
        seen: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return messages;
  } catch (error: any) {
    return [];
  }
};
export { getConversations, getConversationById, getMessages };
