import prisma from "@/lib/prismadb";
import { auth } from "@/auth";
import { UserRole } from "@prisma/client";

const getProducers = async () => {
  const session = await auth();

  if (!session?.user?.email) {
    return [];
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        role: UserRole.PRODUCER,
        NOT: {
          email: session?.user?.email,
        },
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

export default getProducers;
