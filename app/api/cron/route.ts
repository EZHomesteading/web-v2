import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET(request: Request) {
  // Verify the request is from your cron service
  const apiKey = request.headers.get("x-api-key");
  if (apiKey !== process.env.CRON_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const newConversation = await prisma.conversation.create({
      data: {
        users: {
          connect: [
            { id: "user with listing" },
            { id: "66fc429f3f6c8d3180c628f0" },
          ],
        },
      },
      include: {
        users: true,
      },
    });
    const newMessage = await prisma.message.create({
      include: {
        seen: true,
        sender: true,
      },
      data: {
        body: "test",
        messageOrder: "100",
        conversation: {
          connect: { id: newConversation.id },
        },
        sender: {
          connect: { id: "66fc429f3f6c8d3180c628f0" },
        },
        seen: {
          connect: {
            id: "66fc429f3f6c8d3180c628f0",
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Cron job completed successfully" },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("Cron job failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
