import prisma from "@/lib/prismadb";
import { auth } from "@/auth";
import { UserRole } from "@prisma/client";

const getCoops = async () => {
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
        role: UserRole.COOP,
        NOT: {
          email: session.user.email,
        },
      },
      include: {
        listings: true,
      },
    });

    const coops = users.map((user) => ({
      name: user.name,
      location: user?.location || null,
      listingsCount: user.listings.length,
    }));

    return coops;
  } catch (error: any) {
    return [];
  }
};

export default getCoops;
