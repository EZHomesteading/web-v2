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
    quantityType,
    stock,
    shelfLife,
    city,
    state,
    zip,
    street,
    location,
    price,
    subCategory,
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
      quantityType,
      stock,
      shelfLife,
      subCategory,
      price,
      street,
      location,
      city,
      state,
      zip,
      userId: currentUser.id,
    },
  });

  return NextResponse.json(listing);
}
