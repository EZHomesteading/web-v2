import { currentUser } from "@/lib/auth";
import prisma from "@/lib/prismadb";

const getConversationById = async (conversationId: string) => {
  try {
    const user = await currentUser();

    if (!user) {
      return null;
    }

    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            role: true,
            image: true,
          },
        },
      },
    });

    if (!conversation) {
      return null;
    }

    const otherUser = conversation.users.find((u) => u.id !== user.id);

    return {
      ...conversation,
      currentUser: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
      otherUser: otherUser
        ? {
            id: otherUser.id,
            name: otherUser.name,
            role: otherUser.role,
            image: otherUser.image,
          }
        : null,
    };
  } catch (error: any) {
    console.log(error, "SERVER_ERROR");
    return null;
  }
};

export default getConversationById;
