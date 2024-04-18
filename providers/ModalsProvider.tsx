"use client";
import SearchModal from "@/app/components/modals/SearchModal";
import RentModal from "../app/components/modals/listing-modal";

const ModalsProvider = () => {
  return (
    <>
      <RentModal />
      <SearchModal />
    </>
  );
};

export default ModalsProvider;
