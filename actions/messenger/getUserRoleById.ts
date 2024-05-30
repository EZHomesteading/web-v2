//get only the users role based on the users ID
import prisma from "@/lib/prismadb";

interface Params {
  userId?: string;
}

export default async function getUserRoleById(params: Params) {
  try {
    const { userId } = params;

    const userRole = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: { role: true },
    });

    if (!userRole) {
      return null;
    }
    return userRole.role;
  } catch (error: any) {
    throw new Error(error);
  }
}
