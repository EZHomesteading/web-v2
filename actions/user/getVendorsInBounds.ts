import prisma from "@/lib/prismadb";
import { UserRole } from "@prisma/client";

export default async function getVendorsInBounds(userCoordinates: number[][]) {
  try {
    const vendors = await prisma.user.findMany({
      where: {
        NOT: { role: UserRole.CONSUMER },
        location: {
          type: "Point",
          coordinates: {
            in: userCoordinates,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        listings: true,
      },
    });

    const totalVendors = vendors.length;

    const safeVendors = vendors.map((user) => ({
      ...user,
      createdAt: user.createdAt.toISOString(),
    }));

    return { vendors: safeVendors, totalVendors };
  } catch (error: any) {
    throw new Error(error);
  }
}
