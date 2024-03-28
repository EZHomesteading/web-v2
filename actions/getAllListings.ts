import prisma from "@/lib/prisma";

export const listings = await prisma.listing.findMany();
