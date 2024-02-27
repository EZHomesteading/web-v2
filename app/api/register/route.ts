// Importing the necessary modules and functions
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import prisma from "@/app/libs/prismadb";

// POST function to create a new user
export async function POST(request: Request) {
  // Parsing the JSON body of the request
  const body = await request.json();

  // Destructuring properties from the request body
  const { email, name, password, role, } = body;

  // Hashing the password using bcrypt with a cost factor of 12
  const hashedPassword = await bcrypt.hash(password, 10);

  // Creating a new user in the database with the hashed password
  const user = await prisma.user.create({
    data: {
      email,
      name,
      hashedPassword,
      role,
    },
  });

  // Returning a JSON response with the created user
  return NextResponse.json(user);
}
