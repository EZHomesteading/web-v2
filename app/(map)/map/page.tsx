//map routes server side page layout
import Map from "@/app/(map)/map/map";
import GetCoops from "@/actions/user/getCoops";
import getProducers from "@/actions/user/getProducers";

const MapPage = async () => {
  const [coops, producers] = await Promise.all([GetCoops(), getProducers()]);
  return <Map coops={coops} producers={producers} />;
};

export default MapPage;
