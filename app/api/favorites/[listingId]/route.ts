// Importing the necessary modules and functions
import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

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

  // Copying favoriteIds from currentUser or initializing an empty array if not available
  let favoriteIds = [...(currentUser.favoriteIds || [])];

  // Adding the new listingId to favoriteIds
  favoriteIds.push(listingId);

  // Updating the user's favoriteIds in the database
  const user = await prisma.user.update({
    where: {
      id: currentUser.id, // Updating the user based on their id
    },
    data: {
      favoriteIds, // Updating favoriteIds
    },
  });

  // Returning a JSON response with the updated user
  return NextResponse.json(user);
}

// DELETE function to remove a listing from favorites
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

  // Copying favoriteIds from currentUser or initializing an empty array if not available
  let favoriteIds = [...(currentUser.favoriteIds || [])];

  // Filtering out the listingId from favoriteIds
  favoriteIds = favoriteIds.filter((id) => id !== listingId);

  // Updating the user's favoriteIds in the database
  const user = await prisma.user.update({
    where: {
      id: currentUser.id, // Updating the user based on their id
    },
    data: {
      favoriteIds, // Updating favoriteIds
    },
  });

  // Returning a JSON response with the updated user
  return NextResponse.json(user);
}
