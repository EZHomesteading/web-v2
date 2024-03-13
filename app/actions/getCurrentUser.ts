// Importing the necessary functions and modules
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import prisma from "@/app/libs/prismadb";

// Function to retrieve the current session
export async function getSession() {
  // Getting the server session using authentication options
  return await getServerSession(authOptions);
}
let currentUser = await getCurrentUser();
// Default function to get the current user
async function getCurrentUser() {
  try {
    // Retrieving the session
    const session = await getSession();

    // If session or user email is not available, return null
    if (!session?.user?.email) {
      return null;
    }

    // Finding the current user in the database using their email
    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
    });

    // If current user is not found, return null
    if (!currentUser) {
      return null;
    }

    // Returning user data with modified date formats
    return {
      ...currentUser,
      createdAt: currentUser.createdAt.toISOString(), // Converting createdAt to ISO string
      updatedAt: currentUser.updatedAt.toISOString(), // Converting updatedAt to ISO string
      emailVerified: currentUser.emailVerified?.toISOString() || null, // Converting emailVerified to ISO string or null if not available
    };
  } catch (error: any) {
    // Catching any errors and returning null
    return null;
  }
}
export default currentUser;
