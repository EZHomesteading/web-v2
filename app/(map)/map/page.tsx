import Map from "@/app/(map)/map/map";
import GetCoops from "@/actions/user/getCoops";
import getProducers from "@/actions/user/getProducers";
import authCache from "@/auth-cache";
import MapContainer from "./map-container";

const MapPage = async () => {
  const [coops, producers] = await Promise.all([GetCoops(), getProducers()]);
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
