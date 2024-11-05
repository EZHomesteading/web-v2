"use client";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  return (
    <div
      className={`absolute top-1/2 right-1/2 transform translate-x-1/2 translate-y-1/2`}
    >
      {" "}
      <div
        className={`flex justify-center flex-col items-center h-full mt-10 `}
      >
        Your wishlist could not be found
        <button
          onClick={() => router.refresh()}
          className={`my-3 text-center bg-black text-white shadow-md p-3 w-full rounded-full max-w-[300px] border  bg-black]`}
        >
          Try again
        </button>
        <button
          onClick={() => router.push("/wishlists")}
          className={`max-w-[300px] border text-center p-3  bg-black] rounded-full w-full`}
        >
          Back to Wishlists
        </button>
      </div>
    </div>
  );
}
