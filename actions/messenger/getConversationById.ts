//get conversation by ID
import { currentUser } from "@/lib/auth";
import prisma from "@/lib/prismadb";
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
            hours: true,
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
        hours: user.hours,
      },
      otherUser: otherUser
        ? {
            id: otherUser.id,
            name: otherUser.name,
            role: otherUser.role,
            image: otherUser.image,
            email: otherUser.email,
            hours: otherUser.hours,
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

export default getConversationById;
