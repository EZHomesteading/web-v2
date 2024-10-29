import React from "react";
import { getUserLocations } from "@/actions/getUser";
import { auth } from "@/auth";
import Calendar from "@/app/selling/(container-selling)/availability-calendar/(components)/calendar";
import { Location } from "@prisma/client";

export default async function EditLocationPage() {
  const session = await auth();

  let locations: Location[] = [];

  const userId = session?.user?.id;
  if (userId) {
    try {
      locations =
        (await getUserLocations({
          userId: userId,
        })) || [];
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  }

  if (locations.length >= 3) {
    return (
      <div className="flex w-full h-2/3 items-center justify-center">
        Sellers are limited to three locations for now
      </div>
    );
  }

  const mk = process.env.MAPS_KEY;
  return <>{mk && <Calendar mk={mk} locations={locations} />}</>;
}
