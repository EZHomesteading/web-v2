"use client";

import { BiSearch } from "react-icons/bi";

import useSearchModal from "@/hooks/modal/useSearchModal";
const Search = () => {
  const searchModal = useSearchModal();

  return (
    <div onClick={searchModal.onOpen} className="cursor-pointer">
      <BiSearch size={18} />
    </div>
  );
};

export default Search;
