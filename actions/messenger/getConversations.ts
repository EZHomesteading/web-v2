// get conversation based on current user
import prisma from "@/lib/prismadb";
import { currentUser } from "@/lib/auth";

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

export default getConversations;
