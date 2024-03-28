//checkout removes stock from listing
import EmptyState from "@/components/EmptyState";
import ClientOnly from "@/components/client/ClientOnly";

import { currentUser } from "@/lib/auth";
import getCartListings from "@/actions/getCartListings";

import Cart from "@/app/(pages)/cart/client";

const SearchPage = async () => {
  const user = await currentUser();
  const listings = await getCartListings();
  if (listings.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="No items in Cart"
          subtitle="Looks like you have no items in your Cart."
          showShop
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <Cart listings={listings} user={user} />
    </ClientOnly>
  );
};
//
export default SearchPage;
