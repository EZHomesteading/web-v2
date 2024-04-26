"use client";

import SearchLocation from "@/app/components/listings/search-listings";

const FindListingsComponent = ({ onClose }: any) => {
  return (
    <>
      <div
        className={`flex flex-col sm:flex-row items-start md:items-center justify-center relative`}
      >
        <SearchLocation />
      </div>
    </>
  );
};

export default FindListingsComponent;
