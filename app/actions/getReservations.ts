// Importing the necessary modules and functions
import prisma from "@/app/libs/prismadb";

// Interface defining the structure of parameters accepted by the function
interface IParams {
  listingId?: string; // Optional parameter: listingId
  userId?: string; // Optional parameter: userId
  authorId?: string; // Optional parameter: authorId
}

// Function to retrieve reservations based on provided parameters
export default async function getReservations(
  params: IParams // Accepting parameters of type IParams
) {
  try {
    // Destructuring parameters
    const { listingId, userId, authorId } = params;

    // Initializing an empty query object
    const query: any = {};

    // Adding conditions to the query based on provided parameters

    if (listingId) {
      query.listingId = listingId; // Filtering by listingId if provided
    }

    if (userId) {
      query.userId = userId; // Filtering by userId if provided
    }

    if (authorId) {
      query.listing = { userId: authorId }; // Filtering by listing's userId if authorId is provided
    }

    // Finding reservations in the database based on the constructed query
    const reservations = await prisma.reservation.findMany({
      where: query, // Applying the constructed query
      include: {
        listing: true, // Including associated listing details
      },
      orderBy: {
        createdAt: "desc", // Ordering the results by createdAt field in descending order
      },
    });

    // Mapping over the reservations to ensure safe handling of data
    const safeReservations = reservations.map((reservation) => ({
      ...reservation,
      createdAt: reservation.createdAt.toISOString(), // Converting createdAt to ISO string
      startDate: reservation.startDate.toISOString(), // Converting startDate to ISO string
      endDate: reservation.endDate.toISOString(), // Converting endDate to ISO string
      listing: {
        ...reservation.listing,
        createdAt: reservation.listing.createdAt.toISOString(), // Converting listing's createdAt to ISO string
      },
    }));

    // Returning the safeReservations array
    return safeReservations;
  } catch (error: any) {
    // Throwing an error if any occurs during the process
    throw new Error(error);
  }
}
