// Importing the necessary modules and functions
import { NextResponse } from "next/server";
import currentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

// POST function to add a listing to favorites
export async function POST(request: Request) {
  const body = await request.json();
  const { street, city, zip, phoneNumber, state, role, name, email } = body;
  // If current user is not available, return an error response
  if (!currentUser) {
    return NextResponse.error();
  }

  // Updating the user's favoriteIds in the database
  const user = await prisma.user.update({
    where: {
      id: currentUser.id, // Updating the user based on their id
    },
    data: {
      street,
      city,
      zip,
      phoneNumber,
      state,
      role,
      name,
      email,
    },
  });

  // Returning a JSON response with the updated user
  return NextResponse.json(user);
}
