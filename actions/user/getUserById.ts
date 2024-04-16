import prisma from "@/lib/prismadb";

interface Params {
  userId?: string;
}

export default async function getUserById(params: Params) {
  try {
    const { userId } = params;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return null;
    }
    console.log(user);
    return user;
  } catch (error: any) {
    throw new Error(error);
  }
}
