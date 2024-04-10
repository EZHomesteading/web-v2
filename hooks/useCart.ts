import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";

interface IUseCart {
  listingId: string;
  user?: any | null;
}

const useCart = ({ listingId, user }: IUseCart) => {
  const router = useRouter();

  const hasCart = useMemo(() => {
    const cartItems = user?.cart || [];
    return cartItems.some((item: any) => item.listingId === listingId);
  }, [user, listingId]);

  const toggleCart = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      try {
        if (hasCart) {
          await axios.delete(`/api/cart/${listingId}`);
        } else {
          if (!listingId) {
            throw new Error("Listing ID is required");
          }
          await axios.post(`/api/cart/${listingId}`, {
            quantity: 1,
            pickup: null,
          });
        }
        router.refresh();
        toast.success("Success");
      } catch (error) {
        toast.error("Something went wrong.");
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
