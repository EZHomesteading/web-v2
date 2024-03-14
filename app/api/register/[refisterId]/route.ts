// Importing the necessary modules and functions
import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUserAsync";
import prisma from "@/app/libs/prismadb";

// Interface defining the structure of parameters accepted by the function

// DELETE function to delete a listing
export async function DELETE(request: Request) {
  // If current user is not available, return an error response
  // Retrieving the current user
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.error();
  }

  // Deleting the listing from the database where id matches listingId and userId matches current user's id
  const listing = await prisma.user.deleteMany({
    where: {
      id: currentUser.id, // Deleting only if the current user is the owner of the listing
    },
  });

  // Returning a JSON response with the deleted listing
  return NextResponse.json(listing);
}
