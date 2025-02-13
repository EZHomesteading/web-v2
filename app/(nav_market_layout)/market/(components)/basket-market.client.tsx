"use client";

import { useState } from "react";
import MarketBasketToggle from "./market-cart-toggle";
import { UserInfo } from "next-auth";

interface ClientBasketButtonProps {
  user: UserInfo | undefined;
  listing: any;
  isInitiallyInBasket: boolean;
}

const ClientBasketButton = ({
  listing,
  user,
  isInitiallyInBasket,
}: ClientBasketButtonProps) => {
  const [isInBasket, setIsInBasket] = useState(isInitiallyInBasket);

  return (
    <MarketBasketToggle
      listing={listing}
      user={user}
      isInBasket={isInBasket}
      onBasketUpdate={(newIsInBasket: boolean) => setIsInBasket(newIsInBasket)}
    />
  );
};

export default ClientBasketButton;
