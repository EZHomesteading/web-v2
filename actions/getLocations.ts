// actions/getLocations.ts
import { auth } from "@/auth";
import { authenticatedFetch } from "@/lib/api-utils";
import { Location } from "@prisma/client";
import { headers } from "next/headers";

export async function getLocationsById(locationIds: string[]): Promise<{
  locations: Location[];
}> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      console.log("No session found");
      return { locations: [] };
    }

    const headersList = headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

    const url = new URL(`/api/locations`, `${protocol}://${host}`);
    url.searchParams.set("ids", locationIds.join(","));

    // Log the URL being called
    console.log("Fetching from URL:", url.toString());

    const response = await authenticatedFetch(url.toString());

    // Log the response status
    console.log("Response status:", response.status);

    if (!response.ok) {
      throw new Error(`Failed to fetch locations: ${response.status}`);
    }

    const data = await response.json();
    return {
      locations: data || [],
    };
  } catch (error) {
    console.error("[GET_LOCATIONS_BY_ID]", error);
    return {
      locations: [],
    };
  }
}
