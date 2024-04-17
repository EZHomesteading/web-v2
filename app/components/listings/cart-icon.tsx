"use client";

import { BiBasket } from "react-icons/bi";
import useCart from "@/hooks/use-cart";

interface CartButtonProps {
  listingId: string;
  user?: any | null;
}

const CartButton: React.FC<CartButtonProps> = ({ listingId, user }) => {
  const { hasCart, toggleCart } = useCart({
    listingId,
    user,
  });
  return (
    <div
      onClick={toggleCart}
      className="
        relative
        hover:opacity-80
        transition
        cursor-pointer
      "
    >
      <BiBasket
        size={24}
        className={hasCart ? "fill-green-500" : "fill-neutral-500/70"}
      />
    </div>
  );
};

export default CartButton;
