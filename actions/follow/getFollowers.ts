import prisma from "@/lib/prismadb";
import { currentUser } from "@/lib/auth";

export default async function getFollowers() {
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
      return following;
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
