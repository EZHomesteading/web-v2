"use client";

import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import useMediaQuery from "@/hooks/media-query";
import SendMessageSection from "./send-messge-section";
import { UserInfo } from "next-auth";
import { Location } from "@prisma/client";
import { OutfitFont } from "@/components/fonts";

interface p {
  listing: any;
  user?: UserInfo;
  locations: Location[] | null;
}
const SendMessageComponent = ({ user, listing, locations }: p) => {
  const over_640px = useMediaQuery("(min-width: 640px)");

  return (
    <>
      {over_640px ? (
        <SendMessageSection
          locations={locations}
          listing={listing}
          user={user}
        />
      ) : (
        <Drawer>
          <DrawerTrigger asChild>
            <button
              className={`fixed bottom-0 w-screen h-20 bg-white border-t`}
            >
              <div className={`flex justify-between pr-4 items-center w-full`}>
                <div>
                  ${listing.price} per {listing.quantityType}
                </div>
                <div
                  className={`w-full max-w-[150px] font-semibold rounded-md py-3 text-sm shadow-sm bg-sky-100 `}
                >
                  Add to Basket
                </div>
              </div>
            </button>
          </DrawerTrigger>
          <DrawerContent
            className={`rounded-t-xl px-2 h-[75vh] ${OutfitFont.className}`}
          >
            <SendMessageSection
              listing={listing}
              locations={locations}
              user={user}
            />
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

export default SendMessageComponent;
