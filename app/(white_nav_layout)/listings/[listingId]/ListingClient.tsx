"use client";
//client side layout for listing page
import { useState } from "react";
import { addDays } from "date-fns";
import Container from "@/components/Container";
import ListingHead from "@/components/listings/ListingHead";
import ListingInfo from "@/components/listings/ListingInfo";
import ListingReservation from "./components/ListingReservation";
import ListingMap from "@/components/map/listing-map";
import useCart from "@/hooks/listing/use-cart";
import { FinalListing } from "@/actions/getListings";
import { User } from "@prisma/client";
import { UserInfo } from "next-auth";

interface ListingClientProps {
  listing: FinalListing & { description: string };
  user?: User | null;
  following:
    | {
        id: string;
        userId: string;
        follows: string[];
      }
    | null
    | undefined;
  apiKey?: string;
}

const ListingClient: React.FC<ListingClientProps> = ({
  listing,
  user,
  following,
  apiKey,
}) => {
  const listingRole = listing?.location?.role;
  const listingUser = listing.user.id;
  const listingId = listing.id;
  const { toggleCart } = useCart({
    listingId,
    user,
    listingRole,
    listingUser,
  });
  //adjusting listings shelflife to be accurate. and be in date format.
  const adjustedListing = {
    ...listing,
    endDate:
      listing.shelfLife !== -1
        ? addDays(new Date(listing.createdAt), listing.shelfLife)
        : null,
  };

  return (
    <Container>
      <div
        className="
          max-w-screen-lg 
          mx-auto
          mt-8
        "
      >
        <div className="flex flex-wrap">
          <div className="w-full lg:w-2/3">
            <ListingHead
              title={listing.title}
              location={listing.location}
              imageSrc={listing.imageSrc}
            />
            <div className="flex flex-col h-full">
              <ListingInfo
                listingUser={listing.user as unknown as UserInfo}
                description={listing.description}
                followUserId={listing.userId}
                following={following}
              />
            </div>
          </div>
          <div className="w-full lg:w-1/3 px-4">
            <ListingReservation
              toggleCart={toggleCart}
              listingId={adjustedListing.id}
              user={user}
              product={adjustedListing}
              sodt={[listing.SODT, listing.user.SODT]}
              rating={listing.rating}
            />
            <div className="mt-5">
              {apiKey && (
                <ListingMap location={listing.location} apiKey={apiKey} />
              )}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ListingClient;
