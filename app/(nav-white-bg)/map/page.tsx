//map routes server side page layout
import { getVendorLocsMap, NavUser } from "@/actions/getUser";
import authCache from "@/auth-cache";
import Map from "@/app/(nav-white-bg)/map/map";
import { UserRole } from "@prisma/client";
import Container from "@/components/Container";
import type { Viewport } from "next";
import MapPopup from "@/app/(nav-white-bg)/info-modals/map-info-modal";
import Navbar from "@/components/navbar/Navbar";

export const viewport: Viewport = {
  themeColor: "white",
};
const MapPage = async () => {
  const map_api_key = process.env.MAPS_KEY as string;
  const session = await authCache();
  const user = session?.user;

  let producers: any = [];

  let coops = await getVendorLocsMap({ role: UserRole.COOP });
  // Fetch producers only if the user has a role of PRODUCER or COOP
  if (user?.role === UserRole.PRODUCER || user?.role === UserRole.COOP) {
    producers = await getVendorLocsMap({ role: UserRole.PRODUCER });
  }
  const defaultLocation = { lat: 44.58, lng: -103.46 };
  const initialLocation = session?.user.location
    ? session?.user.location[0]
      ? {
          lat: session?.user?.location[0].coordinates[1],
          lng: session?.user?.location[0].coordinates[0],
        }
      : defaultLocation
    : defaultLocation;

  return (
    <div className="h-sreen overflow-hidden touch-none">
      <div className="relative w-full z-10 shadow-sm">
        <Container>
          <Navbar user={user as unknown as NavUser} />
        </Container>
      </div>
      <div className="h-[calc(100vh-64px)] overflow-hidden touch-none">
        <Map
          coordinates={initialLocation}
          coops={coops}
          producers={producers}
          mk={map_api_key}
          user={user}
        />
      </div>
      <MapPopup />
    </div>
  );
};

export default MapPage;
