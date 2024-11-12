"use client";

import { useEffect, useState } from "react";
import { addDays } from "date-fns";
import Container from "@/components/Container";
import ListingHead from "@/components/listings/ListingHead";
import ListingInfo from "@/components/listings/ListingInfo";
import ListingData from "./components/ListingData";
import ListingMap from "@/components/map/listing-map";
import { FinalListing } from "@/actions/getListings";
import { User } from "@prisma/client";
import { UserInfo } from "next-auth";
import { Loader2 } from "lucide-react";
import { useBasket } from "@/hooks/listing/use-basket";

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
  const [isInitialized, setIsInitialized] = useState(false);

  const {
    isLoading: isListLoading,
    checkExistingItem,
    isInBasket,
    quantity,
  } = useBasket({
    listingId: listing.id,
    user,
    initialQuantity: listing.minOrder || 1,
  });

  useEffect(() => {
    const initializeBasketState = async () => {
      if (user) {
        await checkExistingItem();
      }
      setIsInitialized(true);
    };

    initializeBasketState();
  }, [user, checkExistingItem]);

  const adjustedListing = {
    ...listing,
    endDate:
      listing.shelfLife !== -1
        ? addDays(new Date(listing.createdAt), listing.shelfLife)
        : null,
  };

  if (!isInitialized || isListLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-12 w-12 animate-spin text-gray-900" />
      </div>
    );
  }

  return (
    <div className="max-w-screen-lg mx-auto mt-8 px-2     ">
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
          <ListingData
            hours={listing.location?.hours}
            listingId={adjustedListing.id}
            user={user}
            product={adjustedListing}
            sodt={[listing.SODT, listing.user.SODT]}
            rating={listing.rating}
          />
          {apiKey && (
            <div className="mt-5">
              <ListingMap location={listing.location} apiKey={apiKey} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingClient;
