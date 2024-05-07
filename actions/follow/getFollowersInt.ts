import prisma from "@/lib/prismadb";
import { currentUser } from "@/lib/auth";

export default async function getFollows() {
  let user = await currentUser();
  const userId = user?.id;
  if (user) {
    try {
      const following = await prisma.following.findMany({
        where: {
          follows: {
            has: userId,
          },
        },
      });

      if (!following) {
        return null;
      }
      return following.length;
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
