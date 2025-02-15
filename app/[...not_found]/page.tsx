import React from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { OutfitFont } from "@/components/fonts";

const Page404 = () => {
  return (
    <div
      className={`${OutfitFont.className} relative h-screen w-screen overflow-hidden`}
    >
      <div className="absolute inset-0">
        <Image
          src="https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTVdG4FFjDhnba7pxgyuH9UBWz3VvNFdw8qMsQ"
          alt="Organic farm background"
          fill
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/80" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-6xl font-bold text-green-400 mb-4">OH CROP!</h1>
        <p className="text-2xl max-w-md text-white mb-8">
          Looks like you got lost in the corn maze... or maybe we gave you bad
          directions.
        </p>
        <Link
          href={`/`}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-full hover:bg-green-600 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Homepage
        </Link>
        <p className="text-sm text-gray-300 absolute bottom-5 max-w-md px-4">
          Is this our fault or yours? We don't like to point fingers, but its
          probably ours. We're a small team, sorry.
        </p>
      </div>
    </div>
  );
};

export default Page404;
