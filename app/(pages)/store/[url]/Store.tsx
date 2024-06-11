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

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  style: "normal",
});

interface StorePageProps {
  store: any;
  user?: any;
  emptyState: React.ReactNode;
  following: any;
}

const StorePage = ({ store, user, emptyState, following }: StorePageProps) => {
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
            <Bio user={store?.user} reviews={store?.reviews} />
          </div>
        </div>
        <div className="pl-[10px]">
          <FollowButton
            followUserId={store?.user?.id}
            following={following}
            user={user}
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
            {store?.user?.listings?.map((listing: any) => (
              <ListingCard
                user={user}
                storeUser={store?.user}
                key={listing.id}
                data={listing}
              />
            ))}
          </div>
        )}
      </Container>
    </ClientOnly>
  );
};

export default StorePage;
