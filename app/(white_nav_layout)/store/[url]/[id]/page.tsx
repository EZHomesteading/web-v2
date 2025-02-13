import Avatar from "@/components/Avatar";
import { OutfitFont } from "@/components/fonts";
import { StoreLocationCard } from "@/app/(nav_market_layout)/market/(components)/store-card";
import { StoreLocationBio } from "../bio";
import Link from "next/link";

import { GetStoreByLocation } from "@/actions/getUser";

interface StorePageProps {
  params: {
    id: string;
  };
}

const StorePage = async ({ params }: StorePageProps) => {
  const { id } = params;
  const data = await GetStoreByLocation({ id: id });

  if (!data?.listings) {
    return (
      <>
        <div
          className={`text-xl ${OutfitFont.className} flex items-center h-[80vh] justify-center`}
        >
          {data?.user?.name || "(Deleted User)"} does not have any listings at
          this location right now
        </div>
      </>
    );
  }
  return (
    <>
      <div className="w-full px-2 mx-auto max-w-[1920px] !z-0 mb-20 ">
        <div className="flex flex-col items-start justify-start relative border border-grey rounded-md p-3 mb-6 h-40 shadow-md">
          <div className="flex justify-center flex-row items-start ">
            <div
              className={`flex flex-col items-start justify-start space-y-0`}
            >
              <div className={`flex items-start justify-start`}>
                <Avatar image={data?.location?.image} h="16" />{" "}
                <StoreLocationBio location={data?.location} />
              </div>
              <div
                className={` ${OutfitFont.className} gap-x-2 flex items-center `}
              >
                <div className={` font-light text-sm`}>
                  {data?.listings?.length} Listings
                </div>
                <div className={`h-1 w-1 bg-black rounded-full`} />
                <p className={`font-light cursor-pointer text-sm`}>
                  {data.location?.address[1]}, {data?.location?.address[2]}
                </p>
              </div>
            </div>
          </div>
          <button
            className={`p-2 text-bold gap-x-1 shadow-sm flex items-center justify-center rounded-md border border-grey w-32 absolute bottom-2 left-2`}
          >
            <p className={`text-bold ${OutfitFont.className}`}>Follow</p>
          </button>
        </div>
        <Link href={`/store/${data?.user?.url}`}>
          <button
            className={`bg-slate-300 border-none zmax shadow-md text-xl rounded-full text-black p-3 ${OutfitFont.className} fixed bottom-[100px] right-1/2 transform translate-x-1/2`}
          >
            Back to Main
          </button>
        </Link>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {data.listings.map((listing: any, index: number) => (
            <StoreLocationCard
              location={data?.location}
              listing={listing}
              imageCount={index}
              key={index}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default StorePage;
