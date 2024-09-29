"use client";
//spinning loading icon
import { PuffLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="flex justify-center items-center min-h-screen authlayoutbg">
      <PuffLoader size={100} color="green" />
    </div>
  );
};

export default Loader;
