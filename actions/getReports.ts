//action to get all disputes (used for admins only)
import prisma from "@/lib/prismadb";

export default async function getReports() {
  try {
    const reports = await prisma.listing.findMany({
      where: {
        reports: {
          not: 0 || null,
        },
      },
      select: {
        id: true,
        reports: true,
        review: true,
      },
      orderBy: {
        reports: "desc",
      },
    });

    return reports || [];
  } catch (error: any) {
    throw new Error(error);
  }
}
