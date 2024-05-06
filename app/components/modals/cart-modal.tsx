"use client";

import useCartModal from "@/hooks/modal/use-cart-modal";

import Modal from "./Modal";
import Heading from "../Heading";

const CartModal = () => {
  const cartModal = useCartModal();
  let bodyContent = <div className="flex flex-col gap-8"></div>;

  return (
    <Modal
      onSubmit={() => {}}
      actionLabel=""
      isOpen={cartModal.isOpen}
      onClose={cartModal.onClose}
      body={bodyContent}
    />
  );
};

export default CartModal;
