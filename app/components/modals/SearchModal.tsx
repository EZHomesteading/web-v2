"use client";

import useSearchModal from "@/hooks/modal/useSearchModal";

import Modal from "./Modal";
import Heading from "../Heading";
import FindListingsComponent from "../listings/search-listings";

const SearchModal = () => {
  const searchModal = useSearchModal();
  const onSubmit = searchModal.onClose;
  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Find produce near you!"
        subtitle="Search by location and keyword"
      />
      <FindListingsComponent />
    </div>
  );

  return (
    <Modal
      actionLabel="Search"
      onSubmit={onSubmit}
      isOpen={searchModal.isOpen}
      onClose={searchModal.onClose}
      body={bodyContent}
    />
  );
};

export default SearchModal;
