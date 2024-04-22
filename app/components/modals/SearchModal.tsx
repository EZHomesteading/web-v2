"use client";

import useSearchModal from "@/hooks/modal/useSearchModal";

import Modal from "./modal-search";
import Heading from "../Heading";
import FindListingsComponent from "./search-listings-native";

const SearchModal = () => {
  const searchModal = useSearchModal();
  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Find produce near you!"
        subtitle="Search by location and keyword"
      />
      <FindListingsComponent onClose={searchModal.onClose} />
    </div>
  );

  return (
    <Modal
      isOpen={searchModal.isOpen}
      onClose={searchModal.onClose}
      body={bodyContent}
    />
  );
};

export default SearchModal;
