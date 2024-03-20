import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";

import { SafeUser } from "@/app/types";

import useLoginModal from "./useLoginModal";

interface IUseCart {
  listingId: string;
  currentUser?: SafeUser | null;
}

const useCart = ({ listingId, currentUser }: IUseCart) => {
  const router = useRouter();

  const loginModal = useLoginModal();

  const hasCart = useMemo(() => {
    const list = currentUser?.cartIds || [];

    return list.includes(listingId);
  }, [currentUser, listingId]);

  const toggleCart = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();

      if (!currentUser) {
        return loginModal.onOpen();
      }

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
    [currentUser, hasCart, listingId, loginModal, router]
  );

  return {
    hasCart,
    toggleCart,
  };
};

export default useCart;
