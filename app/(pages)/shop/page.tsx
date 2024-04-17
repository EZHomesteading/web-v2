import dynamic from "next/dynamic";
import EmptyState from "@/app/components/EmptyState";
import { currentUser } from "@/lib/auth";
import ClientOnly from "../../components/client/ClientOnly";
import getListingsApi from "@/actions/listing/getListingsApi";
import getUserwithCart from "@/actions/user/getUserWithCart";

interface ShopProps {
  userId?: string;
  searchParams?: {
    q?: string;
    lat?: string;
    lng?: string;
    radius?: string;
    page?: string;
  };
}

const DynamicShop = dynamic(() => import("@/app/(pages)/shop/Shop"), {
  ssr: true,
});

const ShopPage = async ({
  searchParams,
}: {
  searchParams?: ShopProps["searchParams"];
}) => {
  const { q = "", lat = "", lng = "", radius = "" } = searchParams || {};
  let page = parseInt(searchParams?.page as string, 10);
  page = !page || page < 1 ? 1 : page;
  const perPage = 12;

  const { listings, totalItems } = await getListingsApi(
    {
      q,
      lat,
      lng,
      radius,
    },
    page,
    perPage
  );
  const userpre = await currentUser();
  const userId = { userId: userpre?.id };
  const user = await getUserwithCart(userId);

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
    <DynamicShop
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
