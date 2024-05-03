import prisma from "@/lib/prismadb";

export default async function getUserWithOrders({
  userId,
}: {
  userId?: string;
}) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        buyerOrders: true,
        sellerOrders: true,
      },
    });

    if (user) {
      user.firstName = user.firstName ?? "";
      return user;
    }

    return null;
  } catch (error: any) {
    throw new Error(error);
  }
}
