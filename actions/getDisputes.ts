import prisma from "@/lib/prismadb";

export default async function getDisputes() {
  try {
    const disputes = await prisma.dispute.findMany({
      select: {
        id: true,
        userId: true,
        images: true,
        status: true,
        reason: true,
        explanation: true,
        email: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
        order: {
          select: {
            conversationId: true,
            buyer: {
              select: {
                id: true,
                email: true,
                phoneNumber: true,
                createdAt: true,
                role: true,
              },
            },
            seller: {
              select: {
                id: true,
                email: true,
                phoneNumber: true,
                createdAt: true,
                role: true,
              },
            },
          },
        },
      },
    });

    if (!disputes) {
      return null;
    }
    return disputes;
  } catch (error: any) {
    throw new Error(error);
  }
}
