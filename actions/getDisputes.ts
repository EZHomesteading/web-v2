//action to get all disputes (used for admins only)
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
            id: true,
            totalPrice: true,
            paymentIntentId: true,
            conversationId: true,
            buyer: {
              select: {
                id: true,
                email: true,
                phoneNumber: true,
                createdAt: true,
                role: true,
                fullName: true,
              },
            },
            seller: {
              select: {
                id: true,
                email: true,
                phoneNumber: true,
                createdAt: true,
                role: true,
                fullName: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return disputes || [];
  } catch (error: any) {
    throw new Error(error);
  }
}
export async function getDisputesLite() {
  try {
    const disputes = await prisma.dispute.findMany({
      select: {
        id: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return disputes || [];
  } catch (error: any) {
    throw new Error(error);
  }
}
