import prisma from "@/lib/prismadb";

const GetOrderByConvoId = async (conversationId: string) => {
  try {
    if (!conversationId) {
      return null;
    }

    const order = await prisma.order.findFirst({
      where: {
        conversationId,
      },
    });

    if (!order) {
      return null;
    }

    return { ...order };
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  }
};

export default GetOrderByConvoId;
