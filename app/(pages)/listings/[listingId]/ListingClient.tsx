"use client";
//client side layout for listing page
import { useState } from "react";
import { addDays } from "date-fns";
import Container from "@/app/components/Container";
import ListingHead from "@/app/components/listings/ListingHead";
import ListingInfo from "@/app/components/listings/ListingInfo";
import ListingReservation from "@/app/(pages)/listings/[listingId]/components/ListingReservation";
import ListingMap from "@/app/components/map/listing-map";
import useCart from "@/hooks/listing/use-cart";
import { FinalListing } from "@/actions/getListings";
import { UserInfo } from "@/next-auth";
import { User } from "@prisma/client";

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
  const listingRole = listing.user.role;
  const listingUser = listing.user.id;
  const listingId = listing.id;
  const { toggleCart } = useCart({
    listingId,
    user,
    listingRole,
    listingUser,
  });
  const [isLoading, setIsLoading] = useState(false);
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
                user={user as unknown as UserInfo}
                listingUser={listing.user as unknown as UserInfo}
                description={listing.description}
                followUserId={listing.userId}
                following={following}
                oRating={listing.rating}
              />
            </div>
          </div>
          <div className="w-full lg:w-1/3 px-4">
            <ListingReservation
              toggleCart={toggleCart}
              listingId={adjustedListing.id}
              user={user}
              product={adjustedListing}
              disabled={isLoading}
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
