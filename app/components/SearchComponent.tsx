"use client";

import React, { useState, useRef, useEffect } from "react";
import LocationSearchInput from "./map/LocationSearchInput";
import SearchClientUser, {
  ProductValue,
} from "@/app/components/client/SearchClientUser";
import { BiSearch } from "react-icons/bi";
import SearchClient from "./client/SearchClient";

const CombinedSearchInput = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [product, setProduct] = useState<ProductValue | null>(null);
  const containerRef = useRef<HTMLDivElement>(null); // Solution: Specify the type for ref

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e: React.FocusEvent) => {
    // Solution: Specify the type for event
    if (
      containerRef.current &&
      !containerRef.current.contains(e.relatedTarget as Node)
    ) {
      setIsFocused(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Solution: Specify the type for event
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [containerRef]);

  return (
    <>
      <div className="flex flex-row">
        <LocationSearchInput
          address={""}
          setAddress={function (value: React.SetStateAction<string>): void {
            throw new Error("Function not implemented.");
          }}
        />

        <SearchClient onChange={setProduct} />
        <BiSearch className="cursor-pointer" size="1.5em" onClick={() => {}} />
      </div>
    </>
  );
};

export default CombinedSearchInput;
