import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/utils/mongodb"; // Adjust import path as needed
import { Db } from "mongodb";

interface Listing {
  title: string;
  location: {
    type: string;
    coordinates: number[];
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { db } = await connectToDatabase();
  const { title, lat, lng } = req.query;

  const latitude = parseFloat(lat as string);
  const longitude = parseFloat(lng as string);

  if (isNaN(latitude) || isNaN(longitude)) {
    res.status(400).json({ error: "Invalid latitude or longitude" });
    return;
  }

  const listings: Listing[] = await db
    .collection<Listing>("listings")
    .find({
      $and: [
        { $text: { $search: title as string } },
        {
          location: {
            $near: {
              $geometry: { type: "Point", coordinates: [longitude, latitude] },
              $maxDistance: 5000,
            },
          },
        },
      ],
    })
    .toArray();

  res.status(200).json(listings);
}
