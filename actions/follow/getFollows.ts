//action to get the current users followed peoples

import prisma from "@/lib/prismadb";
import { currentUser } from "@/lib/auth";

export default async function getFollows() {
  let user = await currentUser();
  const userId = user?.id;
  if (user) {
    try {
      const following = await prisma.following.findUnique({
        where: {
          userId: userId,
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
