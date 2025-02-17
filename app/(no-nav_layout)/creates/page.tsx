import { getUserLocations } from "@/actions/getLocations";
import { auth } from "@/auth";
import { UserRole } from "@prisma/client";
import CreateClient from "./create-client";
const CreatesPage = async ({
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
    (loc) =>
      (loc?.id === searchParams?.id || loc?.isDefault) &&
      loc.role !== UserRole.CONSUMER
  );
  return (
    <CreateClient
      defaultLoc={defaultLocation}
      locs={locations}
      user={session?.user}
    />
  );
};
export default CreatesPage;
