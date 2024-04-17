import prisma from "@/lib/prismadb";

interface Params {
  userId?: string;
}

export default async function getUserwithCart(params: Params) {
  try {
    const { userId } = params;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: { cart: true },
    });

    if (!user) {
      return null;
    }
    return user;
  } catch (error: any) {
    throw new Error(error);
  }
}
