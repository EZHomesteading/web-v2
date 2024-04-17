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
          email: session.user.email,
        },
      },
      include: {
        listings: true,
      },
    });

    const producers = users.map((user) => ({
      name: user.name,
      coordinates: user?.location?.coordinates,
      listingsCount: user.listings.length,
    }));

    return producers;
  } catch (error: any) {
    return [];
  }
};

export default getProducers;
