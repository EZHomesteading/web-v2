import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

// POST function to create a new listing
export async function POST(request: Request) {
  // Retrieving the current user*

  // Parsing the JSON body of the request
  const body = await request.json();

  // Destructuring properties from the request body
  const {
    id,
    description,
    imageSrc,
    category,
    quantityType,
    stock,
    shelfLife,
    price,
  } = body;

  // Checking if any required field is missing in the request body, then return an error response
  Object.keys(body).forEach((value: any) => {
    if (!body[value]) {
      NextResponse.error();
    }
  });

  // Creating a new listing in the database
  const listing = await prisma.listing.update({
    where: { id: id },
    data: {
      description,
      imageSrc,
      category,
      quantityType,
      stock,
      shelfLife,
      price, // Parsing price to integer
    },
  });

  // Returning a JSON response with the created listing
  return NextResponse.json(listing);
}
