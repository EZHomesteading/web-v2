import prisma from "@/libs/prismadb";

export const listings = await prisma.listing.findMany();
