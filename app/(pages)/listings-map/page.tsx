import ListingsMap from "@/app/components/map/markers-map";
import { currentUser } from "@/lib/auth";
import GetCoops from "@/actions/user/getCoops";
import getProducers from "@/actions/user/getProducers";
import UserCard from "@/app/components/listings/user-card";
import dynamic from "next/dynamic";
import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "@/app/components/client/ClientOnly";
interface MapProps {
  searchParams?: {
    q?: string;
    lat?: string;
    lng?: string;
    radius?: string;
    page?: string;
  };
}

const DynamicMapPage = dynamic(
  () => import("@/app/(pages)/listings-map/listings")
);

const MapPage = async ({
  searchParams,
}: {
  searchParams?: MapProps["searchParams"];
}) => {
  const { q = "", lat = "", lng = "", radius = "" } = searchParams || {};
  let page = parseInt(searchParams?.page as string, 10);
  page = !page || page < 1 ? 1 : page;
  const perPage = 20;

  //   const { coops, totalItems } = await getListingsApi(
  //     {
  //       q,
  //       lat,
  //       lng,
  //       radius,
  //     },
  //     page,
  //     perPage
  //   );

  const totalPages = Math.ceil(20 / perPage);
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

  const user = await currentUser();
  const userCoordinates = user?.location
    ? { lng: user.location.coordinates[0], lat: user.location.coordinates[1] }
    : null;
  const coops = await GetCoops();
  const producers = await getProducers();
  const coopCoordinates = coops?.map((user: any) => ({
    lat: user?.location.coordinates[1],
    lng: user?.location.coordinates[0],
  }));
  const producerCoordinates = producers?.map((user: any) => ({
    lat: user?.location.coordinates[1],
    lng: user?.location.coordinates[0],
  }));
  return (
    <div className="w-full h-full flex flex-row">
      <div className="w-1/2">
        <DynamicMapPage
          users={coops}
          emptyState={
            coops.length === 0 ? (
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
        <ListingsMap
          coopCoordinates={coopCoordinates}
          producerCoordinates={producerCoordinates}
          userCoordinates={userCoordinates}
        />
      </div>
    </div>
  );
};

export default MapPage;
