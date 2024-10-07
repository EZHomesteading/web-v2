import prisma from "@/lib/prismadb";

export default async function getHarvestMessages(userId: string | undefined) {
  if (!userId) {
    return;
  }
  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        userIds: {
          has: userId,
        },
      },
      select: {
        id: true,
        lastMessageAt: true,
      },
    });

    const conversationData = await Promise.all(
      conversations.map(async (conversation) => {
        const convoIdWithHarvest = await prisma.message.findMany({
          where: {
            conversationId: conversation.id,
            messageOrder: "100",
          },
          select: {
            conversationId: true,
          },
        });

        // Return the conversation data if it has a harvest message, otherwise null
        return convoIdWithHarvest[0]
          ? {
              conversationId: conversation.id,
              lastMessageAt: conversation.lastMessageAt,
            }
          : null;
      })
    );

    // Filter out any null values and ensure uniqueness
    const uniqueConversations = Array.from(
      new Map(
        conversationData
          .filter(
            (item): item is { conversationId: string; lastMessageAt: Date } =>
              item !== null
          )
          .map((item) => [item.conversationId, item])
      ).values()
    );

    return uniqueConversations;
  } catch (error: any) {
    throw new Error(error);
  }
}
