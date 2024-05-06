import MarkersMap from "@/app/(find)/map/vendor-map";
import GetCoops from "@/actions/user/getCoops";
import getProducers from "@/actions/user/getProducers";
import getVendors from "@/actions/user/getVendors";
interface MapProps {
  searchParams?: {
    page?: string;
  };
}

const MapPage = async ({
  searchParams,
}: {
  searchParams?: MapProps["searchParams"];
}) => {
  const { vendors, totalvendors } = await getVendors(1, 20);

  const [coops, producers] = await Promise.all([GetCoops(), getProducers()]);

  return (
    <MarkersMap
      coops={coops}
      producers={producers}
      totalvendors={totalvendors}
      vendors={vendors}
    />
  );
};

export default MapPage;
