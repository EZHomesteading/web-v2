import prisma from "@/lib/prismadb";
import { currentUser } from "@/lib/auth";

export default async function getUserwithCart() {
  let user = await currentUser();
  const userId = user?.id;
  if (user) {
    try {
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
}
