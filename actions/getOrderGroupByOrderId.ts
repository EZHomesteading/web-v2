import prisma from "@/lib/prisma";

export async function getOrderGroupIdByOrderId(orderId: string) {
  const orderGroup = await prisma.orderGroup.findFirst({
    where: {
      orderids: {
        has: orderId,
      },
    },
    select: {
      id: true,
    },
  });
  return orderGroup?.id || null;
}
