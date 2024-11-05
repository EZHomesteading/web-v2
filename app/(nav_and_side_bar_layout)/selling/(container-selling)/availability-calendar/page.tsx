import React from "react";
import { getUserLocations } from "@/actions/getUser";
import { auth } from "@/auth";
import Calendar from "./(components)/calendar";
import { Location } from "@prisma/client";
import SelectDefaultLoc from "./(components)/select-default-loc";

interface EditLocationPageProps {
  params: { id: string };
}

export default async function EditLocationPage({
  params,
}: EditLocationPageProps) {
  const session = await auth();
  const locationId = params.id;

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
  console.log(locations);
  const location = locations.find((loc) => loc.isDefault === true);
  if (locations.length > 0 && !location) {
    return <SelectDefaultLoc locations={locations} user={session?.user} />;
  }
  if (!location || location.userId !== userId) {
    return (
      <div className="flex w-full h-2/3 items-center justify-center">
        Invalid location or unauthorized access.
      </div>
    );
  }

  const mk = process.env.MAPS_KEY;
  return (
    <>
      {mk && (
        <Calendar
          location={location}
          id={locationId}
          mk={mk}
          locations={locations}
          userId={session?.user?.id}
        />
      )}
    </>
  );
}
