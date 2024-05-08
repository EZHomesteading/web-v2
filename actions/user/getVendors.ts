import prisma from "@/lib/prismadb";
import { UserRole } from "@prisma/client";

export default async function GetVendors(page: number, perPage: number) {
  try {
    let vendors = await prisma.user.findMany({
      where: {
        NOT: {
          role: UserRole.CONSUMER,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        listings: true,
      },
    });

    const totalvendors = vendors.length;
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedvendors = vendors.slice(startIndex, endIndex);

    const safevendors = paginatedvendors.map((user) => ({
      name: user.name,
      location: user?.location,
      listingsCount: user?.listings.length,
      createdAt: user.createdAt.toISOString(),
    }));
    return { vendors: safevendors, totalvendors };
  } catch (error: any) {
    throw new Error(error);
  }
}
