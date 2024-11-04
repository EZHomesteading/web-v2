import { getListingById } from "@/actions/getListings";
import { MarketListing } from "@/app/(nav_market_layout)/market/_components/market-component";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";

interface IUseCart {
  user?: any | null;
  listingId: string;
}

const useCart = async ({ user, listingId }: IUseCart) => {
  const router = useRouter();
  const cartItems = user?.cart || [];
  const listing = await getListingById({ listingId });
  if (!listing) {
    return null;
  }
  const hasCart = useMemo(
    () => cartItems.some((item: any) => item.listingId === listingId),
    [cartItems, listingId]
  );

  const toggleCart = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>, quantity = 1) => {
      e.stopPropagation();

      if (!user) {
        router.push(
          `/auth/login?callbackUrl=${encodeURIComponent(window.location.href)}`
        );
        return;
      }

      try {
        if (hasCart) {
          const cartId = cartItems.find(
            (item: any) => item.listingId === listingId
          )?.id;
          if (cartId)
            await axios.delete(`/api/useractions/checkout/cart/${cartId}`);
        } else {
          if (!listingId) throw new Error("Listing ID is required");
          await axios.post(`/api/useractions/checkout/cart/${listingId}`, {
            quantity,
            pickup: null,
          });
        }

        router.refresh();
        toast.success("Your cart was updated!");
      } catch (error) {
        if (
          listing.location?.role === "PRODUCER" &&
          (!user || ["CONSUMER", "PRODUCER"].includes(user.role))
        ) {
          toast.error("Must be a Co-Op to add Producers listings");
        } else if (listing.user.id === user.id) {
          toast.error("Can't add your own listings to cart");
        } else {
          toast.error("Something went wrong");
        }
      }
    },
    [
      user,
      hasCart,
      listingId,
      router,
      cartItems,
      listing.location?.role,
      listing.user.id,
    ]
  );

  return { hasCart, toggleCart };
};

export default useCart;
