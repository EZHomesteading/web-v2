"use client";
//extra spinning loading icon
import { PuffLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <PuffLoader size={100} color="green" />
    </div>
  );
};

export default Loader;
