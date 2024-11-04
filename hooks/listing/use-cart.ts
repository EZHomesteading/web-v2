// hooks/listing/use-cart.ts
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import axios from "axios";

interface UseWishlistCartProps {
  listingId: string;
  user?: any | null;
  initialQuantity?: number;
}

export const useWishlistCart = ({
  listingId,
  user,
  initialQuantity = 1,
}: UseWishlistCartProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState(initialQuantity);
  const [isInWishlist, setIsInWishlist] = useState(false);

  const checkExistingItem = useCallback(async () => {
    if (!user) return null;

    try {
      const response = await axios.get(`/api/wishlist/check/${listingId}`);
      setIsInWishlist(!!response.data);
      return response.data;
    } catch (error) {
      console.error("Error checking wishlist:", error);
      return null;
    }
  }, [listingId, user]);

  const addToWishlist = useCallback(
    async (status: "ACTIVE" | "SAVED_FOR_LATER" = "ACTIVE") => {
      if (!user) {
        router.push(
          `/auth/login?callbackUrl=${encodeURIComponent(window.location.href)}`
        );
        return;
      }

      setIsLoading(true);
      try {
        await axios.post(`/api/wishlist/items`, {
          listingId,
          quantity,
          status,
        });
        setIsInWishlist(true);
        toast.success("Added to cart!");
        router.refresh();
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    },
    [user, listingId, quantity, router]
  );

  const removeFromWishlist = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // First get the wishlist item ID
      const item = await checkExistingItem();
      if (!item?.id) {
        throw new Error("Item not found");
      }

      // Then delete using the item ID
      await axios.delete(`/api/wishlist/items/${item.id}`);
      setIsInWishlist(false);
      toast.success("Removed from cart");
      router.refresh();
    } catch (error: any) {
      console.error("Remove error:", error);
      toast.error(error.response?.data?.message || "Failed to remove item");
    } finally {
      setIsLoading(false);
    }
  }, [user, checkExistingItem, router]);

  const toggleWishlist = useCallback(
    async (
      e: React.MouseEvent<HTMLButtonElement>,
      status: "ACTIVE" | "SAVED_FOR_LATER" = "ACTIVE"
    ) => {
      e.stopPropagation();

      if (isInWishlist) {
        await removeFromWishlist();
      } else {
        await addToWishlist(status);
      }
    },
    [isInWishlist, removeFromWishlist, addToWishlist]
  );

  return {
    isLoading,
    quantity,
    setQuantity,
    isInWishlist,
    checkExistingItem,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
  };
};
