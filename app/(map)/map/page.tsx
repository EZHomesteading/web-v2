//map routes server side page layout
import { getVendors } from "@/actions/getUser";
import authCache from "@/auth-cache";
import Map from "@/app/(map)/map/map";
import { UserRole } from "@prisma/client";
import Container from "@/app/components/Container";
import Logo from "@/app/components/navbar/Logo";
import UserMenu from "@/app/components/navbar/UserMenu";
import type { Viewport } from "next";
import { navUser } from "@/next-auth";

export const viewport: Viewport = {
  themeColor: "white",
};
const MapPage = async () => {
  const map_api_key = process.env.MAPS_KEY as string;
  const session = await authCache();
  const user = session?.user;

  let producers: {
    location: number[];
    id: string;
  }[] = [];

  let coops = await getVendors({ role: UserRole.COOP });
  // Fetch producers only if the user has a role of PRODUCER or COOP
  if (user?.role === UserRole.PRODUCER || user?.role === UserRole.COOP) {
    producers = await getVendors({ role: UserRole.PRODUCER });
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
      <div className="relative w-full z-10 shadow-sm h-[64px]">
        <div className="py-4">
          <Container>
            <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
              <Logo />
              <UserMenu user={user as unknown as navUser} />
            </div>
          </Container>
        </div>
      </div>
      <div className="h-[calc(100vh-64px)] overflow-hidden touch-none">
        <Map
          coordinates={initialLocation}
          coops={coops}
          producers={producers}
          mk={map_api_key}
          userRole={session?.user.role}
        />
      </div>
    </div>
  );
};

export default MapPage;
