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
    const list = user?.cartIds || [];

    return list.includes(listingId);
  }, [user, listingId]);

  const toggleCart = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();

      try {
        let request;

        if (hasCart) {
          request = () => axios.delete(`/api/cart/${listingId}`);
        } else {
          request = () => axios.post(`/api/cart/${listingId}`);
        }

        await request();
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
