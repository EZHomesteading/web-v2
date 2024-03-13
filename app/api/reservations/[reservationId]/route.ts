// Importing the necessary modules and functions
import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

// Interface defining the structure of parameters accepted by the function
interface IParams {
  reservationId?: string; // Optional parameter: reservationId
}

// DELETE function to delete a reservation
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

  // Destructuring reservationId from the parameters
  const { reservationId } = params;

  // Checking if reservationId is not provided or not a string, then throw an error
  if (!reservationId || typeof reservationId !== "string") {
    throw new Error("Invalid ID");
  }

  // Deleting the reservation from the database where id matches reservationId
  // and either userId or listing's userId matches the current user's id
  const reservation = await prisma.reservation.deleteMany({
    where: {
      id: reservationId, // Deleting based on reservationId
      OR: [
        { userId: currentUser.id }, // Deleting if the current user is the owner of the reservation
        { listing: { userId: currentUser.id } }, // Deleting if the current user is the owner of the listing associated with the reservation
      ],
    },
  });

  // Returning a JSON response with the deleted reservation
  return NextResponse.json(reservation);
}
