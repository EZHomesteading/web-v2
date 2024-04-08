import prisma from "@/lib/prismadb";

export const listings = await prisma.listing.findMany();
