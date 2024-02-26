// Importing the necessary modules and functions
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

// POST function to create a new listing
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
  const {
    title,
    description,
    imageSrc,
    category,
    roomCount,
    bathroomCount,
    guestCount,
    location,
    price,
  } = body;

  // Checking if any required field is missing in the request body, then return an error response
  Object.keys(body).forEach((value: any) => {
    if (!body[value]) {
      NextResponse.error();
    }
  });

  // Creating a new listing in the database
  const listing = await prisma.listing.create({
    data: {
      title,
      description,
      imageSrc,
      category,
      roomCount,
      bathroomCount,
      guestCount,
      locationValue: location.value, // Assuming location is an object with a 'value' property
      price: parseInt(price, 10), // Parsing price to integer
      userId: currentUser.id, // Associating the listing with the current user
    },
  });

  // Returning a JSON response with the created listing
  return NextResponse.json(listing);
}
