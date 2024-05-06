"use client";
import useSearchModal from "@/hooks/modal/useSearchModal";
import { BiSearch } from "react-icons/bi";

const SearchNative = () => {
  const searchModal = useSearchModal();
  return <BiSearch onClick={searchModal.onOpen} className="block sm:hidden" />;
};

export default SearchNative;
