"use client";

import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { addDays, format } from "date-fns";

import useLoginModal from "@/app/hooks/useLoginModal";
import { SafeListing, SafeUser } from "@/app/types";

import Container from "@/app/components/Container";
import ListingHead from "@/app/components/listings/ListingHead";
import ListingInfo from "@/app/components/listings/ListingInfo";
import ListingReservation from "@/app/components/listings/ListingReservation";
import ListingMap from "@/app/components/map/listingMap";

interface ListingClientProps {
  listing: SafeListing & {
    user: SafeUser;
    shelfLife: number;
    city: string;
    state: string;
    street: string;
    zip: string;
    price: number;
    quantityType: string;
  };
  currentUser?: SafeUser | null;
}

const ListingClient: React.FC<ListingClientProps> = ({
  listing,
  currentUser,
}) => {
  const loginModal = useLoginModal();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const onCreatePurchase = () => {
    if (!currentUser) {
      return loginModal.onOpen();
    }
    setIsLoading(true);

    toast
      .promise(
        axios.post("/api/something", {
          listingId: listing.id,
        }),
        {
          loading: "loading",
          success: "success",
          error: "failed",
        }
      )
      .finally(() => {
        setIsLoading(false);
      });
  };

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
              city={listing.city}
              state={listing.state}
              imageSrc={listing.imageSrc}
              id={listing.id}
              currentUser={currentUser}
            />
            <ListingInfo
              user={listing.user}
              description={listing.description}
            />
          </div>
          <div className="w-full lg:w-1/3 px-4">
            <ListingReservation
              product={adjustedListing}
              onSubmit={onCreatePurchase}
              disabled={isLoading}
            />
            <div className="mt-5">
              <ListingMap
                street={listing.street}
                city={listing.city}
                state={listing.state}
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ListingClient;
