"use client";
//client side layout for users store page
import Container from "@/app/components/Container";
import ListingCard from "@/app/components/listings/ListingCard";
import ClientOnly from "@/app/components/client/ClientOnly";
import OpenStatus from "@/app/(pages)/store/[url]/hours-status";
import Avatar from "@/app/components/Avatar";
import { Outfit } from "next/font/google";
import Bio from "./bio";
import FollowButton from "@/app/components/follow/followButton";
import { FinalListingShop, StoreData } from "@/actions/getUser";
import { ExtendedHours, UserInfo } from "@/next-auth";
import { FinalListing } from "@/actions/getListings";
import ReactStars from "react-stars";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  style: "normal",
});

interface StorePageProps {
  store: (StoreData | null) & { user: { hours: ExtendedHours } };
  user?: UserInfo;
  emptyState: React.ReactNode;
  following:
    | {
        id: string;
        userId: string;
        follows: string[];
      }
    | null
    | undefined;
}

const StorePage = ({ store, user, emptyState, following }: StorePageProps) => {
  function averageArrayLength(arrayOfArrays: FinalListingShop[]) {
    if (arrayOfArrays.length === 0) return 0;

    const totalLength = arrayOfArrays.reduce((sum, shop) => {
      return sum + (shop.rating?.length || 0);
    }, 0);

    return totalLength / arrayOfArrays.length;
  }
  const avgRating = averageArrayLength(store.user.listings);
  console.log(store);
  return (
    <ClientOnly>
      <Container>
        <div className="flex justify-between">
          <div className="flex flex-row items-center">
            {store?.user?.image ? (
              <Avatar image={store?.user?.image} />
            ) : (
              <Avatar image={``} />
            )}

            <div
              className={`${outfit.className} weight-100 flex flex-col ml-2`}
            >
              <div className="flex flex-row items-center gap-x-2">
                <div className="font-bold text-2xl lg:text-4xl">
                  {store?.user?.name}
                </div>
                {store?.user?.hours && (
                  <OpenStatus hours={store?.user?.hours} />
                )}
              </div>

              <div>{store?.user?.firstName}</div>
            </div>
          </div>
          <div className="flex justify-center">
            <Bio
              user={store?.user as unknown as UserInfo}
              reviews={store?.reviews}
            />
          </div>
        </div>
        <div className="pl-[10px]">
          <FollowButton followUserId={store?.user?.id} following={following} />
        </div>
        <div className="text-sm text-gray-600 flex items-center gap-x-1">
          Average Organic Rating:
          <ReactStars
            count={5}
            size={20}
            color2={"#ffd700"}
            value={avgRating}
            half={true}
            edit={false}
          />
        </div>
        {emptyState || (
          <div
            className="
              pt-2
              grid 
              grid-cols-1 
              sm:grid-cols-2 
              md:grid-cols-3 
              lg:grid-cols-4
              xl:grid-cols-5
              2xl:grid-cols-6
              gap-8
            "
          >
            {/* dynamically map users listings */}
            {store?.user?.listings?.map((listing: FinalListingShop) => (
              <ListingCard
                user={user as unknown as UserInfo}
                storeUser={store?.user as unknown as UserInfo}
                key={listing.id}
                data={listing as unknown as FinalListing}
              />
            ))}
          </div>
        )}
      </Container>
    </ClientOnly>
  );
};

export default StorePage;
