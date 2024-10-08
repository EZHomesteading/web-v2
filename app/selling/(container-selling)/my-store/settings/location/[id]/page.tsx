import React from "react";
import { getLocationByIndex } from "@/actions/getUser";
import { auth } from "@/auth";
import Client from "./client";

interface EditLocationPageProps {
  params: { id: string };
}

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

  const mk = process.env.MAPS_KEY;
  return (
    <>
      {mk ? (
        <>
          <Client
            user={session?.user}
            location={location}
            mk={mk}
            locationIndex={locationIndex}
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
}
