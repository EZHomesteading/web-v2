import prisma from "@/lib/prismadb";
import { currentUser } from "@/lib/auth";
const getConversationById = async (conversationId: string) => {
  try {
    const user = await currentUser();

    if (!user?.email) {
      return null;
    }

    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });

    return conversation;
  } catch (error: any) {
    console.log(error, "SERVER_ERROR");
    return null;
  }
};

export default getConversationById;
