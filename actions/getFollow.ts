//action to get the current users followed peoples

import prisma from "@/lib/prismadb";
import { currentUser } from "@/lib/auth";
import authCache from "@/auth-cache";

const getFollows = async () => {
  const session = await authCache();
  if (session?.user) {
    try {
      const following = await prisma.following.findUnique({
        where: {
          userId: session?.user?.id,
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
};
const getFollowers = async () => {
  const session = await authCache();
  if (session?.user) {
    try {
      const following = await prisma.following.findMany({
        where: {
          follows: {
            has: session?.user?.id,
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
};

export { getFollowers, getFollows };
