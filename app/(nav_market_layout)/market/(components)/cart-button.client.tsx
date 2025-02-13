"use client";

import { useState } from "react";
import MarketCartToggle from "./market-cart-toggle";
import { UserInfo } from "next-auth";

interface ClientCartButtonProps {
  user: UserInfo | undefined;
  listing: any;
  isInitiallyInBasket: boolean;
}

const ClientCartButton = ({
  listing,
  user,
  isInitiallyInBasket,
}: ClientCartButtonProps) => {
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

export default ClientCartButton;
