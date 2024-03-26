// Importing the necessary modules and functions
import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import prisma from "@/app/libs/prismadb";

// Interface defining the structure of parameters accepted by the functions
interface IParams {
  listingId?: string; // Optional parameter: listingId
}

// POST function to add a listing to carts
export async function POST(
  request: Request,
  { params }: { params: IParams } // Accepting parameters of type IParams
) {
  // Retrieving the current user
  const currentUserr = await currentUser();
  // If current user is not available, return an error response
  if (!currentUserr) {
    return NextResponse.error();
  }

  // Destructuring listingId from the parameters
  const { listingId } = params;

  // Checking if listingId is not provided or not a string, then throw an error
  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid ID");
  }

  // Copying cartIds from currentUser or initializing an empty array if not available
  let cartIds = [...(currentUserr.cartIds || [])];

  // Adding the new listingId to cartIds
  cartIds.push(listingId);

  // Updating the user's cartIds in the database
  const user = await prisma.user.update({
    where: {
      id: currentUserr.id, // Updating the user based on their id
    },
    data: {
      cartIds, // Updating cartIds
    },
  });

  // Returning a JSON response with the updated user
  return NextResponse.json(user);
}

// DELETE function to remove a listing from carts
export async function DELETE(
  request: Request,
  { params }: { params: IParams } // Accepting parameters of type IParams
) {
  const currentUserr = await currentUser();
  // If current user is not available, return an error response
  if (!currentUserr) {
    return NextResponse.error();
  }

  // Destructuring listingId from the parameters
  const { listingId } = params;

  // Checking if listingId is not provided or not a string, then throw an error
  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid ID");
  }

  // Copying cartIds from currentUser or initializing an empty array if not available
  let cartIds = [...(currentUserr.cartIds || [])];

  // Filtering out the listingId from cartIds
  cartIds = cartIds.filter((id) => id !== listingId);

  // Updating the user's cartIds in the database
  const user = await prisma.user.update({
    where: {
      id: currentUserr.id, // Updating the user based on their id
    },
    data: {
      cartIds, // Updating cartIds
    },
  });

  // Returning a JSON response with the updated user
  return NextResponse.json(user);
}
