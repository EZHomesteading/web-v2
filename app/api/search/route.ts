import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import type { SafeListing } from "@/app/types";
import { Prisma } from "@prisma/client";

// Function to calculate distance between two coordinates in kilometers
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number | null,
  lon2: number | null
): number {
  if (lat2 === null || lon2 === null) return Infinity;
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SafeListing[] | { message: string }>
) {
  if (req.method === "GET") {
    try {
      const { title, lat, lng, category, subCategory } = req.query;

      const userLatitude = parseFloat(lat as string);
      const userLongitude = parseFloat(lng as string);
      if (isNaN(userLatitude) || isNaN(userLongitude)) {
        return res
          .status(400)
          .json({ message: "Invalid latitude or longitude" });
      }

      let where: Prisma.ListingWhereInput = {};

      // Conditionally add filters to the where clause
      if (title) {
        where.title = { contains: title as string, mode: "insensitive" };
      }
      if (category) {
        where.category = category as string;
      }
      if (subCategory) {
        where.subCategory = subCategory as string;
      }

      const rawListings = await prisma.listing.findMany({
        where,
        select: {
          id: true,
          title: true,
          description: true,
          latitude: true,
          longitude: true,
          category: true,
          subCategory: true,
          // Ensure to select all fields required by SafeListing
          createdAt: true,
        },
      });

      // Convert listings and filter by distance
      const maxDistance = 10; // in kilometers
      const listingsNearUser = rawListings
        .map((listing) => ({
          ...listing,
          createdAt: listing.createdAt.toISOString(), // Convert createdAt to string
        }))
        .filter(
          (listing) =>
            calculateDistance(
              userLatitude,
              userLongitude,
              listing.latitude ?? 0,
              listing.longitude ?? 0
            ) <= maxDistance
        );

      return res.status(200).json(listingsNearUser);
    } catch (error) {
      console.error("Search API error:", error);
      return res
        .status(500)
        .json({ message: "Server error during the search" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
