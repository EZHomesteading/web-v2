import CreateClient from "./components/CreateClient";
import type { Viewport } from "next";
import CreatePopup from "../../(white_nav_layout)/info-modals/create-info-modal";
import { getUserLocations } from "@/actions/getLocations";
import { auth } from "@/auth";
import { UserRole } from "@prisma/client";

export const viewport: Viewport = {
  themeColor: "#fff",
};

const Page = async ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  const session = await auth();
  if (!session) {
    window.location.replace("/");
  }
  let locations = await getUserLocations({ userId: session?.user?.id });

  locations = locations?.filter((loc) => loc.role !== UserRole.CONSUMER); // i hate javascript

  const defaultLocation = locations?.find(
    (loc) => loc?.id === searchParams?.id && loc.role !== UserRole.CONSUMER
  );

  return (
    <>
      <CreateClient
        user={session?.user}
        locations={locations}
        defaultLocation={defaultLocation}
      />
      <CreatePopup />
    </>
  );
};
export default Page;
