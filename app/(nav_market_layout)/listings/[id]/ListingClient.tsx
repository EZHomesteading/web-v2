"use client";
import Toast from "@/components/ui/toast";
import Link from "next/link";
import { useEffect, useState } from "react";
import { addDays } from "date-fns";
import ListingHead from "@/components/listings/ListingHead";
import ListingInfo from "@/components/listings/ListingInfo";
//import ListingData from "./components/ListingData";
import ListingMap from "@/components/map/listing-map";
import { FinalListing } from "@/actions/getListings";
import { UserInfo } from "next-auth";
import { Loader2 } from "lucide-react";
import { useBasket } from "@/hooks/listing/use-basket";
import HoursWarningModal from "../../market/(components)/cartHoursWarning";

interface ListingClientProps {
  listing: any;
  user?: any;
  following:
    | {
        id: string;
        userId: string;
        follows: string[];
      }
    | null
    | undefined;
  apiKey?: string;

  basketItemIds?: Array<{ listingId: string; id: string }> | null;
}

const ListingClient: React.FC<ListingClientProps> = ({
  listing,
  user,
  following,
  apiKey,
  basketItemIds = [],
}) => {
  const [isInitialized, setIsInitialized] = useState(false);

  const {
    isLoading,
    toggleBasket,
    showWarning,
    setShowWarning,
    incompatibleDays,
    addToBasket,
  } = useBasket({
    listingId: listing.id,
    user,
    initialQuantity: listing.minOrder || 1,
    hours: listing?.location?.hours,
    basketItemIds,
  });
  const listingId = listing.id;
  const isInBasket =
    Array.isArray(basketItemIds) &&
    basketItemIds.some((item) => item?.listingId === listingId);

  const handleToggleBasket = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!user) {
      Toast({
        message: "Please sign in to add items to your basket",
        details: (
          <Link
            href={`/auth/login?callbackUrl=/listings/${listingId}`}
            className={`text-sky-400 underline font-light`}
          >
            Sign in here
          </Link>
        ),
      });
      return;
    }

    try {
      await toggleBasket(e, isInBasket, "ACTIVE");
    } catch (error) {
      Toast({ message: "Failed to update basket" });
    }
  };

  const adjustedListing = {
    ...listing,
    endDate:
      listing.shelfLife !== -1
        ? addDays(new Date(listing.createdAt), listing.shelfLife)
        : null,
  };

  if (!isInitialized || isLoading) {
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
          <ListingHead listing={listing} />
          <div className="flex flex-col h-full">
            <ListingInfo
              listingUser={listing.user as unknown as UserInfo}
              description={listing.description}
              followUserId={listing.userId}
              following={following}
            />
          </div>
        </div>
        <div className="w-full lg:w-1/3 sm:px-2 ">
          {/* <ListingData
            hours={listing.location?.hours}
            listingId={adjustedListing.id}
            user={user}
            product={adjustedListing}
            sodt={[listing.SODT]}
            rating={listing.rating}
          /> */}
          {apiKey && (
            <div className="mt-5">
              <ListingMap location={listing.location} apiKey={apiKey} />
            </div>
          )}
        </div>
      </div>
      <HoursWarningModal
        isOpen={showWarning}
        onClose={() => setShowWarning(false)}
        onConfirm={() => {
          setShowWarning(false);
          addToBasket("ACTIVE");
        }}
        incompatibleDays={incompatibleDays}
        type={listing?.location?.hours?.pickup ? "pickup" : "delivery"}
      />
    </div>
  );
};

export default ListingClient;
