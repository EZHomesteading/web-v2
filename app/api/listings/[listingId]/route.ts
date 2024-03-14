// Importing the necessary modules and functions
import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUserAsync";
import prisma from "@/app/libs/prismadb";

// Interface defining the structure of parameters accepted by the function
interface IParams {
  listingId?: string; // Optional parameter: listingId
}

// DELETE function to delete a listing
export async function DELETE(
  request: Request,
  { params }: { params: IParams } // Accepting parameters of type IParams
) {
  // Retrieving the current user
  const currentUser = await getCurrentUser();
  // If current user is not available, return an error response
  if (!currentUser) {
    return NextResponse.error();
  }

  // Destructuring listingId from the parameters
  const { listingId } = params;

  // Checking if listingId is not provided or not a string, then throw an error
  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid ID");
  }

  // Deleting the listing from the database where id matches listingId and userId matches current user's id
  const listing = await prisma.listing.deleteMany({
    where: {
      id: listingId, // Deleting based on listingId
      userId: currentUser.id, // Deleting only if the current user is the owner of the listing
    },
  });

  // Returning a JSON response with the deleted listing
  return NextResponse.json(listing);
}
