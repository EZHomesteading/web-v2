import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

interface IParams {
  messageId: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const { messageId } = params;

    if (!messageId) {
      return new NextResponse("Missing messageId", { status: 400 });
    }

    const existingMessage = await prisma.message.findUnique({
      where: {
        id: messageId,
      },
    });

    if (!existingMessage) {
      return new NextResponse("Message not found", { status: 404 });
    }

    const deletedMessage = await prisma.message.delete({
      where: {
        id: messageId,
      },
    });

    return NextResponse.json(deletedMessage, { status: 200 });
  } catch (error) {
    console.error("Error deleting message:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
