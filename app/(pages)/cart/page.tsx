import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "@/app/components/client/ClientOnly";
import { currentUser } from "@/lib/auth";
import { getAllCartItemsByUserId } from "@/actions/getCart";

import Cart from "./client";

const SearchPage = async () => {
  const cartItems = await getAllCartItemsByUserId();
  const user = await currentUser();
  if (cartItems.length === 0) {
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
      <Cart cartItems={cartItems} user={user} />
    </ClientOnly>
  );
};
//
export default SearchPage;
