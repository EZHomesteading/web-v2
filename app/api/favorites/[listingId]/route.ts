// Importing the necessary modules and functions
import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import prisma from "@/libs/prismadb";

// Interface defining the structure of parameters accepted by the functions
interface IParams {
  listingId?: string; // Optional parameter: listingId
}

// POST function to add a listing to favorites
export async function POST(
  request: Request,
  { params }: { params: IParams } // Accepting parameters of type IParams
) {
  // Retrieving the current user
  const user = await currentUser();
  // If current user is not available, return an error response
  if (!user) {
    return NextResponse.error();
  }

  // Destructuring listingId from the parameters
  const { listingId } = params;

  // Checking if listingId is not provided or not a string, then throw an error
  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid ID");
  }

  // Copying favoriteIds from currentUser or initializing an empty array if not available
  let favoriteIds = [...(user.favoriteIds || [])];

  // Adding the new listingId to favoriteIds
  favoriteIds.push(listingId);

  // Updating the user's favoriteIds in the database
  const UpdatedUser = await prisma.user.update({
    where: {
      id: user.id, // Updating the user based on their id
    },
    data: {
      favoriteIds, // Updating favoriteIds
    },
  });

  // Returning a JSON response with the updated user
  return NextResponse.json(UpdatedUser);
}

// DELETE function to remove a listing from favorites
export async function DELETE(
  request: Request,
  { params }: { params: IParams } // Accepting parameters of type IParams
) {
  const user = await currentUser();
  // If current user is not available, return an error response
  if (!user) {
    return NextResponse.error();
  }

  // Destructuring listingId from the parameters
  const { listingId } = params;

  // Checking if listingId is not provided or not a string, then throw an error
  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid ID");
  }

  // Copying favoriteIds from currentUser or initializing an empty array if not available
  let favoriteIds = [...(user.favoriteIds || [])];

  // Filtering out the listingId from favoriteIds
  favoriteIds = favoriteIds.filter((id) => id !== listingId);

  // Updating the user's favoriteIds in the database
  const updatedUser = await prisma.user.update({
    where: {
      id: user.id, // Updating the user based on their id
    },
    data: {
      favoriteIds, // Updating favoriteIds
    },
  });

  // Returning a JSON response with the updated user
  return NextResponse.json(updatedUser);
}
