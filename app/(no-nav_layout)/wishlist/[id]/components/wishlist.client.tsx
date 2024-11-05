"use client";

import { WishlistLocation } from "@/actions/getUser";
import WishlistButtons from "./wishlist-settings";
import Map from "./map-wishlist";
import { zillaFont } from "@/components/fonts";
import useMediaQuery from "@/hooks/media-query";

interface p {
  wishlist: any;
  userLocs: WishlistLocation[] | null;
  mk: string;
}

const WishlistClient = ({ wishlist, userLocs, mk }: p) => {
  const over_640px = useMediaQuery("(min-width: 640px)");
  console.log(over_640px);
  return (
    <>
      <div
        className={`fixed top-2 w-[calc(100%/2)] sm:top-20 left-0 ml-1 sm:ml-3 md:ml-7 lg:ml-[3.75rem] 2xl:ml-[7.75rem] bg-white`}
      >
        <WishlistButtons wishlist={wishlist} userLocs={userLocs} />
      </div>
      {over_640px && (
        <div className="fixed right-0 top-2 sm:top-20 w-[calc(100%/3)] px-1">
          <div className="flex flex-col justify-between gap-2  h-fit">
            <div className={`border rounded-md shadow-md p-3 mb-2`}>
              {[
                {
                  label: "Proposed Pickup Date",
                  value: wishlist?.pickupDate?.toString() || "Not Set",
                },
                {
                  label: "Proposed Delivery Location",
                  value: wishlist?.proposedLoc?.address[0],
                },
                {
                  label: "Proposed Delivery Date",
                  value: wishlist?.pickupDate?.toString() || "Not Set",
                },
                {
                  label: "Notes",
                  value: "None",
                  isTruncated: true,
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`${zillaFont.className} flex justify-between w-full items-start `}
                >
                  <div className={`mb-3 font-semibold text-lg`}>
                    {item.label}
                  </div>
                  <div
                    className={`${
                      item.isTruncated ? "truncate max-w-[200px]" : ""
                    }  underline`}
                  >
                    {item.value}
                  </div>
                </div>
              ))}{" "}
              <button
                className={`w-full border rounded-md p-3 bg-[#007aff] text-white `}
              >
                Send Message to Seller
              </button>
            </div>
          </div>
          <div className={` rounded-t-md`}>
            <Map
              mk={mk}
              showSearchBar={false}
              maxZ={14}
              minZ={10}
              wishlistStyle={`h-[500px] w-full rounded-md shadow-md`}
              // proposedLoc={{
              //   lat: wishlist.proposedLoc.coordinates[1],
              //   lng: wishlist.proposedLoc.coordinates[0],
              // }}
              // sellerLoc={{
              //   lat: wishlist.proposedLoc.coordinates[1],
              //   lng: wishlist.proposedLoc.coordinates[0],
              // }}
              center={{
                lat: wishlist.location.coordinates[1],
                lng: wishlist.location.coordinates[0],
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default WishlistClient;
