"use client";
import useSearchModal from "@/hooks/modal/useSearchModal";
import { BiSearch } from "react-icons/bi";

const SearchNative = () => {
  const searchModal = useSearchModal();
  return (
    <BiSearch
      onClick={searchModal.onOpen}
      className="block xl:hidden w-9 h-9 "
    />
  );
};

export default SearchNative;
