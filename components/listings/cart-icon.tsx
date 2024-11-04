"use client";
import { FinalListing } from "@/actions/getListings";
import { MarketListing } from "@/app/(nav_market_layout)/market/_components/market-component";
import useCart from "@/hooks/listing/use-wishlist";
import { UserInfo } from "next-auth";

interface CartButtonProps {
  listing: FinalListing;
  user?: UserInfo;
}

const CartButton: React.FC<CartButtonProps> = async ({ user, listing }) => {
  console.log(listing);
  const hasCart = await useCart({
    user,
    listingId: listing.id,
  });
  if (!hasCart) {
    return;
  }

  return (
    <div
      onClick={(e) => hasCart.toggleCart(e, listing.minOrder || 1)} // Ensure `listing.minOrder` is accessible
      className="
        hover:opacity-80
        transition
        cursor-pointer
        absolute top-3 right-3
      "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="black"
      >
        <defs>
          <path
            id="icon-path"
            d="M21 9h-1.42l-3.712-6.496-1.736.992L17.277 9H6.723l3.146-5.504-1.737-.992L4.42 9H3a1.001 1.001 0 0 0-.965 1.263l2.799 10.264A2.005 2.005 0 0 0 6.764 22h10.473c.898 0 1.692-.605 1.93-1.475l2.799-10.263A.998.998 0 0 0 21 9zm-3.764 11v1-1H6.764L4.31 11h15.38l-2.454 9zM9 13h2v5H9zm4 0h2v5h-2z"
          />
        </defs>

        <use href="#icon-path" fill="none" stroke="white" stroke-width="0.6" />
        <use
          href="#icon-path"
          fill="rgba(0,0,0,0.7)"
          stroke="white"
          stroke-width="0.3"
        />
      </svg>
    </div>
  );
};

export default CartButton;
