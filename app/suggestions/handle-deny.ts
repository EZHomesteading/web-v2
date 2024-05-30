"use server";
//admin only suggestion page deny handler
import prisma from "@/lib/prisma";

export const handleDeny = async (suggestionId: string) => {
  await prisma.suggestion.delete({
    where: {
      id: suggestionId,
    },
  });
};
