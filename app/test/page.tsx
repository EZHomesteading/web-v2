import { currentUser } from "@/lib/auth";
import ReservationFlow from "./client";
import { getUserLocations } from "@/actions/getUser";
import { Location } from "@prisma/client";

const Page = async () => {
  const mk = process.env.MAPS_KEY!;
  const user = await currentUser();
  let locations: Location[] = [];

  const userId = user?.id;
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
  return (
    <>
      <ReservationFlow mk={mk} sellerLoc={locations[0]} locations={locations} />
    </>
  );
};

export default Page;
