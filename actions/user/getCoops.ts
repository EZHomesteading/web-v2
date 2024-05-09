import prisma from "@/lib/prismadb";
import { auth } from "@/auth";
import { UserRole } from "@prisma/client";

const getCoops = async () => {
  const session = await auth();
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        role: UserRole.COOP,
        NOT: session?.user?.email
          ? {
              email: session.user.email,
            }
          : {},
        listings: {
          some: {},
        },
      },
      select: {
        id: true,
        name: true,
        firstName: true,
        image: true,
        location: {
          select: {
            coordinates: true,
          },
        },
        listings: {
          select: {
            imageSrc: true,
          },
        },
      },
    });

    return users;
  } catch (error: any) {
    return [];
  }
};

export default getCoops;
