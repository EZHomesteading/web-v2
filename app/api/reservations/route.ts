// Importing the necessary modules and functions
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUserAsync";

// POST function to create a reservation for a listing
export async function POST(request: Request) {
  // Retrieving the current user
  const currentUser = await getCurrentUser();
  // If current user is not available, return an error response
  if (!currentUser) {
    return NextResponse.error();
  }

  // Parsing the JSON body of the request
  const body = await request.json();

  // Destructuring properties from the request body
  const { listingId, startDate, endDate, totalPrice } = body;

  // Checking if any required field is missing in the request body, then return an error response
  if (!listingId || !startDate || !endDate || !totalPrice) {
    return NextResponse.error();
  }

  // Creating a reservation for the listing in the database with the provided details
  const listingAndReservation = await prisma.listing.update({
    where: {
      id: listingId, // Updating the listing based on listingId
    },
    data: {
      reservations: {
        create: {
          // Creating a new reservation
          userId: currentUser.id, // Associating the reservation with the current user
          startDate, // Setting the start date of the reservation
          endDate, // Setting the end date of the reservation
          totalPrice, // Setting the total price of the reservation
        },
      },
    },
  });

  // Returning a JSON response with the updated listing and created reservation
  return NextResponse.json(listingAndReservation);
}
