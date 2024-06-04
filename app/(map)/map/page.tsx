//map routes server side page layout
import { getVendors } from "@/actions/getUser";
import authCache from "@/auth-cache";
import Map from "@/app/(map)/map/map";
import { UserRole } from "@prisma/client";

const MapPage = async () => {
  const [coops, producers] = await Promise.all([
    getVendors({ role: UserRole.COOP }),
    getVendors({ role: UserRole.PRODUCER }),
  ]);
  // const session = await authCache();
  // const userLocation = session?.user?.location?.coordinates ?? [];
  // const defaultLocation = { lat: 44.58, lng: -103.46 };
  // const initialLocation =
  //   userLocation.length > 0
  //     ? { lat: userLocation[1], lng: userLocation[0] }
  //     : defaultLocation;
  return (
    <Map coordinates={{ lat: 0, lng: 0 }} coops={coops} producers={producers} />
  );
};

export default MapPage;
