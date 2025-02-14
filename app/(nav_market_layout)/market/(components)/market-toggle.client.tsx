"use client";

import { useState } from "react";
import { UserInfo } from "next-auth";
import MarketCartToggle from "./v2.market-cart-toggle";

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
    <MarketCartToggle
      listing={listing}
      user={user}
      isInBasket={isInBasket}
      onBasketUpdate={(newIsInBasket: boolean) => setIsInBasket(newIsInBasket)}
    />
  );
};

export default ClientBasketButton;
