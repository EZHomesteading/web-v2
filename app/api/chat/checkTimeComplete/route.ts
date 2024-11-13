// get conversation based on current user
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";
import { getUserById } from "@/data/user";

export async function POST() {
  try {
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - 72 * 60 * 60 * 1000);

    const orders = await prisma.order.findMany({
      where: {
        completedAt: {
          not: null,
          lt: threeDaysAgo,
        },
        status: {
          in: ["COMPLETED"],
        },
      },
      select: {
        id: true,
        conversationId: true,
        completedAt: true,
        status: true,
      },
    });
    if (orders.length === 0) {
      console.log("No orders found matching the criteria");
      return NextResponse.json(
        { message: "No orders to process" },
        { status: 200 }
      );
    }
    await Promise.all(
      orders.map(async (order) => {
        if (order.completedAt) {
          try {
            const existingConversation = await prisma.conversation.findUnique({
              where: {
                id: order.conversationId as string,
              },
            });

            if (!existingConversation) {
              console.log(`Conversation not found for order ${order.id}`);
              return;
            }

            await prisma.$transaction([
              prisma.conversation.delete({
                where: {
                  id: order.conversationId as string,
                },
              }),
              prisma.message.deleteMany({
                where: {
                  conversationId: order.conversationId as string,
                },
              }),
              prisma.order.update({
                where: { id: order.id },
                data: {
                  conversationId: null,
                  status: order.status,
                  completedAt: null,
                },
              }),
            ]);

            existingConversation.participantIds.forEach(async (userId) => {
              const user = await getUserById(userId);
              if (!user) {
                return;
              }
              if (user.email) {
                pusherServer.trigger(
                  user.email,
                  "conversation:remove",
                  existingConversation
                );
              }
            });

            console.log(`Successfully processed order ${order.id}`);
          } catch (error) {
            console.error(`Error processing order ${order.id}:`, error);
          }
        }
      })
    );

    return NextResponse.json(
      { message: `Successfully processed ${orders.length} orders` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST function:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
