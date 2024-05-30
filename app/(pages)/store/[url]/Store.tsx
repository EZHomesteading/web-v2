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
  storeUser: any;
  user?: any;
  emptyState: React.ReactNode;
  following: any;
}

const StorePage = ({
  storeUser,
  user,
  emptyState,
  following,
}: StorePageProps) => {
  return (
    <ClientOnly>
      <Container>
        <div className="flex justify-between">
          <div className="flex flex-row items-center">
            {storeUser?.image ? (
              <Avatar image={storeUser?.image} />
            ) : (
              <Avatar image={``} />
            )}

            <div
              className={`${outfit.className} weight-100 flex flex-col ml-2`}
            >
              <div className="flex flex-row items-center gap-x-2">
                <div className="font-bold text-2xl lg:text-4xl">
                  {storeUser?.name}
                </div>
                {storeUser?.hours && <OpenStatus hours={storeUser?.hours} />}
              </div>

              <div>{storeUser?.firstName}</div>
            </div>
            <div className="pl-[10px]">
              <FollowButton
                followUserId={storeUser?.id}
                following={following}
                user={user}
              />
            </div>
          </div>
          <div className="flex justify-center">
            <Bio user={storeUser} />
          </div>
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
            {storeUser?.listings?.map((listing: any) => (
              <ListingCard
                user={user}
                storeUser={storeUser}
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
