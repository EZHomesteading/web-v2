"use client";
//search listings based on location parent component
import SearchLocation from "@/app/components/navbar/search-listings-native";

const FindListingsComponent = ({ onClose }: any) => {
  return (
    <>
      <div
        className={`flex flex-col sm:flex-row items-start md:items-center justify-center relative`}
      >
        <SearchLocation onClose={onClose} />
      </div>
    </>
  );
};

export default FindListingsComponent;
