//checkout removes stock from listing
import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "@/app/components/client/ClientOnly";

import getCurrentUser from "@/app/actions/getCurrentUserAsync";
import getCartListings from "@/app/actions/getCartListings";

import Cart from "./client";

import { HeartFilledIcon } from "@radix-ui/react-icons";
import Link from "next/link";

const SearchPage = async () => {
  const currentUser = await getCurrentUser();
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
      <Cart listings={listings} currentUser={currentUser} />
    </ClientOnly>
  );
};

export default SearchPage;
