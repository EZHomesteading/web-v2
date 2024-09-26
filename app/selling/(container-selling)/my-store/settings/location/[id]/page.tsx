import React from "react";
import { LocationObj } from "@prisma/client";
import { getLocationByIndex } from "@/actions/getUser";
import { auth } from "@/auth";

interface EditLocationPageProps {
  params: { id: string };
}

const locationHeadings = [
  { text: "Default Location", style: "text-xl mt-2 font-bold" },
  { text: "Secondary Location", style: "text-xl mt-2 font-semibold" },
  { text: "Third Location", style: "text-xl mt-2 font-medium" },
];

export default async function EditLocationPage({
  params,
}: EditLocationPageProps) {
  const session = await auth();
  const locationIndex = parseInt(params.id, 10);
  if (locationIndex !== 0 && locationIndex !== 1 && locationIndex !== 2) {
  }

  let location;
  const userId = session?.user?.id;
  if (userId) {
    try {
      location = await getLocationByIndex({
        index: locationIndex as 0 | 1 | 2,
        userId: userId,
      });
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  }

  if (!location) {
  }
  const heading = locationHeadings[locationIndex] || {
    text: "Location",
    style: "text-xl mt-2 font-bold",
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className={heading.style}>{heading.text}</h1>
      <div className="mt-4">
        <h2 className="text-lg font-semibold">Current Address</h2>
        <p>{location?.address?.join(", ")}</p>
      </div>
      <div className="mt-4">
        <h2 className="text-lg font-semibold">Current Hours</h2>
      </div>
    </div>
  );
}

async function fetchLocationByIndex(index: number): Promise<LocationObj> {
  return {} as LocationObj;
}
