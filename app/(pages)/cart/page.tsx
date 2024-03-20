//pull data here (format if needed)
//push data to client
//render data on cart
//checkout removes stock from listing
import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "@/app/components/client/ClientOnly";

import getCurrentUser from "@/app/actions/getCurrentUserAsync";
import getCartListings from "@/app/actions/getCartListings";

import Cart from "./client";

const SearchPage = async () => {
  const currentUser = await getCurrentUser();
  const listings = await getCartListings();
  console.log(listings);
  if (listings.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="No favorites found"
          subtitle="Looks like you have no favorite products."
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <Cart listings={listings} currentUser={currentUser} />
    </ClientOnly>
  );
};

export default SearchPage;
