import MarkersMap from "@/app/(find)/markers-map";
import GetCoops from "@/actions/user/getCoops";
import getProducers from "@/actions/user/getProducers";
import dynamic from "next/dynamic";
import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "@/app/components/client/ClientOnly";
import getVendors from "@/actions/user/getVendors";

interface MapProps {
  searchParams?: {
    q?: string;
    lat?: string;
    lng?: string;
    radius?: string;
    page?: string;
  };
}

const DynamicMapPage = dynamic(() => import("@/app/(find)/map/listings"));

const MapPage = async ({
  searchParams,
}: {
  searchParams?: MapProps["searchParams"];
}) => {
  const { q = "", lat = "", lng = "", radius = "" } = searchParams || {};
  let page = parseInt(searchParams?.page as string, 10);
  page = !page || page < 1 ? 1 : page;
  const perPage = 20;

  const { vendors, totalvendors } = await getVendors(
    {
      q,
      lat,
      lng,
      radius,
    },
    page,
    perPage
  );

  const totalPages = Math.ceil(totalvendors / perPage);
  const prevPage = page - 1 > 0 ? page - 1 : 1;
  const nextPage = page + 1;
  const isPageOutOfRange = page > totalPages;

  const pageNumbers = [];
  const offsetNumber = 3;

  for (let i = page - offsetNumber; i <= page + offsetNumber; i++) {
    if (i >= 1 && i <= totalPages) {
      pageNumbers.push(i);
    }
  }

  const [coops, producers] = await Promise.all([GetCoops(), getProducers()]);
  const intLat = parseInt(searchParams?.lat ?? "0", 10);
  const intLng = parseInt(searchParams?.lat ?? "0", 10);
  const userCoordinates = [intLat, intLng];
  return (
    <div className="w-full h-full flex flex-row">
      <div className="w-full md:w-1/2">
        <DynamicMapPage
          users={vendors}
          emptyState={
            vendors.length === 0 ? (
              <ClientOnly>
                <EmptyState showReset />
              </ClientOnly>
            ) : null
          }
          totalPages={totalPages}
          prevPage={prevPage}
          nextPage={nextPage}
          isPageOutOfRange={isPageOutOfRange}
          pageNumbers={pageNumbers}
          currentPage={page}
        />
      </div>
      <div className="w-1/2">
        <MarkersMap
          userCoordinates={userCoordinates}
          coops={coops}
          producers={producers}
        />
      </div>
    </div>
  );
};

export default MapPage;
