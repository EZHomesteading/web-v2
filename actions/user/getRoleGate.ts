import { currentUser } from "@/lib/auth";
import prisma from "@/lib/prismadb";

export default async function GetRoleGate() {
  const currentUserr = await currentUser();
  if (!currentUserr) {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: currentUserr?.id,
      },
      select: {
        role: true,
      },
    });

    if (user) {
      return user;
    }
    return null;
  } catch (error: any) {
    throw new Error(error);
  }
}
