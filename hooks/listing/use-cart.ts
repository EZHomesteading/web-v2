import { UserRole } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";
interface IUseCart {
  listingId: string;
  user?: any | null;
  quantity?: number;  
  storeUserInfo: {
    id: string;
    role: UserRole;
  };
}

const useCart = ({ listingId, user, storeUserInfo }: IUseCart) => {
  const router = useRouter();
  const cartItems = user?.cart || [];

  const hasCart = useMemo(() => {
    return cartItems.some((item: any) => item.listingId === listingId);
  }, [user, listingId]);
  const toggleCart = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>, quantity: number) => {
      e.stopPropagation();
      if (!user) {
        let callbackUrl = window.location.href;
        // if (nextUrl.search) {
        //   callbackUrl += nextUrl.search;
        // }
        const encodedCallbackUrl = encodeURIComponent(callbackUrl);

        router.push(`/auth/login?callbackUrl=${encodedCallbackUrl}`);
        return;
      }

      if (!quantity) {
        quantity = 1;
      }
      try {
        if (hasCart) {
          const matchingObject = cartItems.find(
            (item: any) => item.listingId === listingId
          );
          const cartId = matchingObject.id;
          await axios.delete(`/api/useractions/checkout/cart/${cartId}`);
        } else {
          if (!listingId) {
            throw new Error("Listing ID is required");
          }
          await axios.post(`/api/useractions/checkout/cart/${listingId}`, {
            quantity: quantity,
            pickup: null,
          });
        }
        router.refresh();
        toast.success("Your cart was updated!");
      } catch (error) {
        if (storeUserInfo.id === user.id) {
          toast.error("Can't add your own listings to cart");
        } else if (
          (user.role === "PRODUCER" && storeUserInfo.role === "PRODUCER") ||
          (storeUserInfo.role === "PRODUCER" && user.role === "CONSUMER") ||
          (storeUserInfo.role === "PRODUCER" && !user)
        ) {
          toast.error("Must be a Co-Op to add Producers listings");
        } else {
          toast.error("Something went wrong");
        }
      }
    },
    [user, hasCart, listingId, router]
  );

  return {
    hasCart,
    toggleCart,
  };
};

export default useCart;
