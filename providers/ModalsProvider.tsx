"use client";

import SearchModal from "@/components/modals/SearchModal";
import CartModal from "@/components/modals/cart-modal";
const ModalsProvider = () => {
  return (
    <>
      <SearchModal />
      <CartModal />
    </>
  );
};

export default ModalsProvider;
