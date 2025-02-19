import { getUserStore } from "@/actions/getUser";
import { UserInfo } from "next-auth";
import { auth } from "@/auth";
import Avatar from "@/components/Avatar";
import { OutfitFont } from "@/components/fonts";
import { Bio } from "./bio";
import Link from "next/link";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { MarketCard } from "@/app/(nav_market_layout)/market/(components)/market-components";

interface StorePageProps {
  params: {
    url: string;
  };
}

// const following = await getFollows();
const StorePage = async ({ params }: StorePageProps) => {
  const { url } = params;
  const store = await getUserStore({ url: url });
  const session = await auth();

  if (!store?.user?.locations) {
    return (
      <>
        <div
          className={`text-xl ${OutfitFont.className} flex items-center h-[80vh] justify-center`}
        >
          {store?.user?.name || "(Deleted User)"} does not have any listings at
          this time
        </div>
      </>
    );
  }

  let basketItemIds: any[] = [];
  if (session) {
    try {
      const res = await fetch(
        `${process.env.API_URL}/get-many?collection=BasketItem&key=userId&value=${session.user?.id}`
      );
      const data = await res.json();
      basketItemIds = data.items;
    } catch (error) {
      console.error(error);
    }
  }
  const numLocs = store?.user?.locations?.length;
  return (
    <>
      <div className="w-full px-2 mx-auto max-w-[1920px] !z-0 mb-20 ">
        <div className="flex flex-col items-start justify-start relative border border-grey rounded-md p-3 mb-6 h-40 shadow-md">
          <div className="flex justify-center flex-row items-start ">
            <div
              className={`flex flex-col items-start justify-start space-y-0`}
            >
              <div className={`flex items-start justify-start`}>
                <Avatar image={store?.user?.image} h="16" />{" "}
                <Bio
                  user={store?.user as unknown as UserInfo}
                  bio={"test"}
                  role={store?.user?.role}
                  reviews={store?.reviews}
                />
              </div>
              <div
                className={` ${OutfitFont.className} gap-x-2 flex items-center `}
              >
                <div className={` font-light text-sm`}>
                  {store.user?.listings?.length} Listings
                </div>
                <div className={`h-1 w-1 bg-black rounded-full`} />
                <Drawer>
                  <DrawerTrigger asChild>
                    <p className={`font-light cursor-pointer text-sm`}>
                      {numLocs} Store{numLocs !== 1 && "s"}
                    </p>
                  </DrawerTrigger>
                  <DrawerContent
                    className={`h-[30vh] text-xl border border-grey ${OutfitFont.className} zmax`}
                  >
                    <DrawerTitle className={`text-center  pt-3`}>
                      Select Location
                    </DrawerTitle>
                    <div className={`p-4`}>
                      {store.user?.locations.map(
                        (location: any, index: number) => (
                          <Link
                            href={`/store/${url}/${location.id}`}
                            className={`flex items-center justify-center gap-x-2 text-sm`}
                            key={index}
                          >
                            {location.displayName || `Location ${index + 1}`}
                            <div
                              className={`w-1 h-1 rouded-full bg-black rounded-full`}
                            />
                            <p>
                              {location?.address[1]}, {location?.address[2]}
                            </p>
                          </Link>
                        )
                      )}
                    </div>
                  </DrawerContent>
                </Drawer>
              </div>
            </div>
          </div>
          <button
            className={`p-2 text-bold gap-x-1 shadow-sm flex items-center justify-center rounded-md border border-grey w-32 absolute bottom-2 left-2`}
          >
            <p className={`text-bold ${OutfitFont.className}`}>Follow</p>
          </button>
        </div>
        {store?.user?.locations?.length > 1 && (
          <Drawer>
            <DrawerTrigger asChild>
              <button
                className={`bg-slate-300 border-none zmax shadow-md text-xl rounded-full text-black p-3 ${OutfitFont.className} fixed bottom-[100px] right-1/2 transform translate-x-1/2`}
              >
                Location Filter
              </button>
            </DrawerTrigger>
            <DrawerContent
              className={`h-[30vh] text-xl border border-grey ${OutfitFont.className} zmax`}
            >
              <DrawerTitle className={`text-center  pt-3`}>
                Select Location
              </DrawerTitle>
              <div className={`p-4`}>
                {store.user?.locations.map((location: any, index: number) => (
                  <Link
                    href={`/store/${url}/${location.id}`}
                    className={`flex items-center justify-center gap-x-2 text-sm`}
                    key={index}
                  >
                    {location.displayName || `Location ${index + 1}`}
                    <div
                      className={`w-1 h-1 rouded-full bg-black rounded-full`}
                    />
                    <p>
                      {location?.address[1]}, {location?.address[2]}
                    </p>
                  </Link>
                ))}
              </div>
            </DrawerContent>
          </Drawer>
        )}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {store.user?.listings.map((listing: any, index: number) => (
            <MarketCard
              listing={listing}
              imageCount={index}
              key={index}
              basketItemIds={basketItemIds}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default StorePage;
