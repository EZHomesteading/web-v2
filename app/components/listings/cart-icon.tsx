"use client";

import { BiBasket } from "react-icons/bi";
import useCart from "@/hooks/listing/use-cart";

interface CartButtonProps {
  listingId: string;
  user?: any | null;
  listingRole: string;
  listingUser: string;
  listingMin: number | null;
}

const CartButton: React.FC<CartButtonProps> = ({
  listingId,
  user,
  listingRole,
  listingUser,
  listingMin,
}) => {
  const { hasCart, toggleCart } = useCart({
    listingId,
    user,
    listingRole,
    listingUser,
  });
  if (!listingMin) {
    listingMin = 1;
  }
  return (
    <div
      onClick={(e) => toggleCart(e, listingMin)}
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
