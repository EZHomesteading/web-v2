//map routes server side page layout
import { getVendors } from "@/actions/getUser";
import authCache from "@/auth-cache";
import MapContainer from "./map-container";
import { UserRole } from "@prisma/client";

const MapPage = async () => {
  const [coops, producers] = await Promise.all([
    getVendors({ role: UserRole.COOP }),
    getVendors({ role: UserRole.PRODUCER }),
  ]);
  const session = await authCache();
  const userLocation = session?.user?.location?.coordinates ?? [];
  const defaultLocation = { lat: 44.58, lng: -103.46 };
  const initialLocation =
    userLocation.length > 0
      ? { lat: userLocation[1], lng: userLocation[0] }
      : defaultLocation;
  return (
    <MapContainer
      coops={coops}
      producers={producers}
      initialLocation={initialLocation}
    />
  );
};

export default MapPage;
