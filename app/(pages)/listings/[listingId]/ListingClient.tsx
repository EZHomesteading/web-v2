"use client";
//client side layout for listing page
import { useState } from "react";
import { useRouter } from "next/navigation";
import { addDays, format } from "date-fns";
import { SafeListing } from "@/types";
import Container from "@/app/components/Container";
import ListingHead from "@/app/components/listings/ListingHead";
import ListingInfo from "@/app/components/listings/ListingInfo";
import ListingReservation from "@/app/(pages)/listings/[listingId]/components/ListingReservation";
import ListingMap from "@/app/components/map/listing-map";
import useCart from "@/hooks/listing/use-cart";
import { Location } from "@prisma/client";

interface ListingClientProps {
  listing: SafeListing & {
    user: any;
    location: Location | null;
  };
  user?: any | null;
  following: any;
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
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  //adjusting listings shelflife to be accurate. and be in date format.
  const adjustedListing = {
    ...listing,
    createdAt: new Date(listing.createdAt),
    endDate:
      listing.shelfLife !== -1
        ? addDays(new Date(listing.createdAt), listing.shelfLife)
        : null,
  };

  const shelfLifeDisplay = adjustedListing.endDate
    ? `Estimated Expiry Date: ${format(
        adjustedListing.endDate,
        "MMM dd, yyyy"
      )}`
    : "This product is non-perisable";

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
                user={listing.user}
                description={listing.description}
                followUserId={listing.user.id}
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
              disabled={isLoading}
              hours={listing.user.hours}
              sodt={[listing.SODT, listing.user.SODT]}
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
