import DrawMap from "@/app/(find)/map/map";
import GetCoops from "@/actions/user/getCoops";
import getProducers from "@/actions/user/getProducers";

const MapPage = async () => {
  const [coops, producers] = await Promise.all([GetCoops(), getProducers()]);
  return <DrawMap coops={coops} producers={producers} />;
};

export default MapPage;
