"use client";

import SearchModal from "@/app/components/modals/SearchModal";
import RentModal from "../app/components/modals/listing-modal";
import CartModal from "@/app/components/modals/cart-modal";
const ModalsProvider = () => {
  return (
    <>
      <RentModal />
      <SearchModal />
      <CartModal />
    </>
  );
};

export default ModalsProvider;
