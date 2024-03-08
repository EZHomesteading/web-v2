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

interface ListingClientProps {
  listing: SafeListing & {
    user: SafeUser;
    shelfLife: number;
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
  const shelfLifeStartDate = new Date(listing.createdAt || new Date());
  const shelfLifeEndDate = addDays(shelfLifeStartDate, listing.shelfLife);

  const isDateRangeValid = shelfLifeStartDate <= shelfLifeEndDate;
  console.log(isDateRangeValid);
  const shelfLifeDisplay = `Best before: ${format(
    shelfLifeEndDate,
    "MMM dd, yyyy"
  )}`;

  return (
    <Container>
      <div
        className="
          max-w-screen-lg 
          mx-auto
        "
      >
        <div className="flex flex-col gap-6">
          <ListingHead
            title={listing.title}
            imageSrc={listing.imageSrc}
            locationValue=""
            id={listing.id}
            currentUser={currentUser}
          />
          <div
            className="
              grid 
              grid-cols-1 
              md:grid-cols-7 
              md:gap-10 
              mt-6
            "
          >
            <ListingInfo
              user={listing.user}
              description={listing.description}
            />
            <div
              className="
                order-first 
                mb-10 
                md:order-last 
                md:col-span-3
              "
            >
              {/* {isDateRangeValid ? (
                <ListingReservation
                  product={listing}
                  onSubmit={onCreatePurchase}
                  disabled={isLoading}
                />
              ) : (
                <p>Error: Invalid date range</p>
              )} */}
            </div>
            <p>{shelfLifeDisplay}</p>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ListingClient;
