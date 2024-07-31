"use client";

import SearchModal from "@/app/components/modals/SearchModal";
import CartModal from "@/app/components/modals/cart-modal";
const ModalsProvider = () => {
  return (
    <>
      <SearchModal />
      <CartModal />
    </>
  );
};

export default ModalsProvider;
