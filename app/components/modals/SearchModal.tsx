"use client";

import useSearchModal from "@/hooks/useSearchModal";

import Modal from "./Modal";
import Heading from "../Heading";
import FindListingsComponent from "../listings/search-listings";

const SearchModal = () => {
  const searchModal = useSearchModal();

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Find produce near you!"
        subtitle="Search by location and keywork"
      />
      <FindListingsComponent />
    </div>
  );

  return (
    <Modal
      isOpen={searchModal.isOpen}
      title="Filters"
      actionLabel="Go"
      onSubmit={() => {}}
      secondaryActionLabel=""
      secondaryAction={() => {}}
      onClose={searchModal.onClose}
      body={bodyContent}
    />
  );
};

export default SearchModal;
