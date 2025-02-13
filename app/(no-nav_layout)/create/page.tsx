import { currentUser } from "@/lib/auth";
import CreateClient from "./components/CreateClient";
import type { Viewport } from "next";
import CreatePopup from "../../(white_nav_layout)/info-modals/create-info-modal";
import { getUserLocations } from "@/actions/getLocations";

export const viewport: Viewport = {
  themeColor: "rgb(255,255,255)",
};

const Page = async ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  const user = await currentUser();
  let index = 1;

  if (!user?.id) {
    return null;
  }
  const locations = await getUserLocations({ userId: user?.id });
  let defaultId: string = "";
  if (searchParams) {
    let defaultLocation = locations?.find((loc) => loc.id === searchParams.id);
    if (defaultLocation) {
      defaultId = defaultLocation.id;
    }
  }
  return (
    <div>
      {user && (
        <>
          <CreateClient
            defaultId={defaultId}
            index={index}
            user={user}
            locations={locations}
          />
          <CreatePopup />
        </>
      )}
    </div>
  );
};
export default Page;
