//display followers parent element
import { auth } from "@/auth";
import Page from "./client";
import { Location } from "@prisma/client";

const SettingPage = async () => {
  const apiKey = process.env.MAPS_KEY as string;
  const session = await auth();

  let locations: Location[] = [];

  const userId = session?.user?.id;
  const res = await fetch(
    `${process.env.API_URL}/get-many?collection=Location&key=userId&value=${userId}&fields=address,coordinates,isDefault,id,userId,displayName`
  );
  const data = await res.json();
  locations = data.items;
  const location = locations.find((loc) => loc.isDefault === true);

  return (
    <Page
      apiKey={apiKey}
      locations={locations}
      user={session?.user}
      location={location}
    />
  );
};

export default SettingPage;
