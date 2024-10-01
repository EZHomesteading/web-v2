import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET(request: Request) {
  console.log("API route hit");
  console.log("Request headers:", request.headers);

  // Verify the request is from your cron service (optional but recommended)
  const apiKey = request.headers.get("x-api-key");
  if (apiKey !== process.env.CRON_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Your cron job logic here
    console.log("Cron job executed!");
    const newConversation = await prisma.conversation.create({
      data: {
        users: {
          connect: [
            { id: "66f8bf60da8399fd811b9dad" },
            { id: "66c37bb923e78a6e81664437" },
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
          connect: { id: "66f8bf60da8399fd811b9dad" },
        },
        seen: {
          connect: {
            id: "66f8bf60da8399fd811b9dad",
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
