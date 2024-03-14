import prisma from "@/app/libs/prismadb";

export const listings = await prisma.listing.findMany();
