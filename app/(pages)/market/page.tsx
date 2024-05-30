//market server side layout with search parameters for grabbing data
import dynamic from "next/dynamic";
import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "../../components/client/ClientOnly";
import { GetListingsMarket } from "@/actions/getListings";
import { getUserwithCart } from "@/actions/getUser";

interface ShopProps {
  userId?: string;
  searchParams?: {
    q?: string;
    lat?: string;
    lng?: string;
    radius?: string;
    page?: string;
    c?: string;
    p?: string;
    s?: string;
  };
}

const MarketComponent = dynamic(
  () => import("@/app/(pages)/market/market-component"),
  {
    ssr: true,
  }
);

const ShopPage = async ({
  searchParams,
}: {
  searchParams?: ShopProps["searchParams"];
}) => {
  const {
    q = "",
    lat = "",
    lng = "",
    radius = "",
    p = "",
    c = "",
    s = "",
  } = searchParams || {};
  let page = parseInt(searchParams?.page as string, 10);
  page = !page || page < 1 ? 1 : page;
  const perPage = 36;

  const { listings, totalItems } = await GetListingsMarket(
    {
      q,
      lat,
      lng,
      radius,
      p,
      c,
      s,
    },
    page,
    perPage
  );
  let user = await getUserwithCart();
  const totalPages = Math.ceil(totalItems / perPage);
  const prevPage = page - 1 > 0 ? page - 1 : 1;
  const nextPage = page + 1;
  const isPageOutOfRange = page > totalPages;

  const pageNumbers = [];
  const offsetNumber = 1003;

  for (let i = page - offsetNumber; i <= page + offsetNumber; i++) {
    if (i >= 1 && i <= totalPages) {
      pageNumbers.push(i);
    }
  }

  return (
    <MarketComponent
      listings={listings}
      user={user}
      emptyState={
        listings.length === 0 ? (
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
  );
};

export default ShopPage;
