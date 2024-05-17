import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Retrieve all users
    const users = await prisma.user.findMany();

    // Iterate over each user and update the createdAt and updatedAt fields
    for (const user of users) {
      const { id, createdAt, updatedAt } = user;

      // Convert the string values to DateTime objects
      const convertedCreatedAt = new Date(createdAt);
      const convertedUpdatedAt = new Date(updatedAt);

      // Update the user record in the database
      await prisma.user.update({
        where: { id },
        data: {
          createdAt: convertedCreatedAt,
          updatedAt: convertedUpdatedAt,
        },
      });
    }

    return NextResponse.json({
      message: "Dates converted and updated successfully.",
    });
  } catch (error) {
    console.error("Error converting and updating dates:", error);
    return NextResponse.json(
      { error: "An error occurred while converting and updating dates." },
      { status: 500 }
    );
  }
}
