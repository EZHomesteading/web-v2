"use client";

import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { addDays, format } from "date-fns";

import { SafeListing } from "@/types";

import Container from "@/app/components/Container";
import ListingHead from "@/app/components/listings/ListingHead";
import ListingInfo from "@/app/components/listings/ListingInfo";
import ListingReservation from "@/app/components/listings/ListingReservation";
import ListingMap from "@/app/components/map/listing-map";
import useCart from "@/hooks/listing/use-cart";
import { Location } from "@prisma/client";
import FollowButton from "@/app/components/follow/followButton";

interface ListingClientProps {
  listing: SafeListing & {
    user: any;
    location: Location | null;
  };
  user?: any | null;
  following: any;
}

const ListingClient: React.FC<ListingClientProps> = ({
  listing,
  user,
  following,
}) => {
  const listingId = listing.id;
  const { toggleCart } = useCart({
    listingId,
    user,
  });
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const onCreatePurchase = () => {
    if (!user) {
      router.push("/auth/login");
    }
    setIsLoading(true);
    if (listing.user.role === "PROUDCER" && user.role === "COOP") {
      toast
        .promise(
          axios.post("/api/listings", {
            title: listing.title,
            description: listing.description,
            imageSrc: listing.imageSrc,
            category: listing.category,
            quantityType: listing.quantityType,
            stock: 1,
            shelfLife: listing.shelfLife,
            subCategory: listing.subCategory,
            price: listing.price,
            location: user?.location,
            userId: user.id,
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
      toast
        .promise(
          axios.post("/api/updateListing", {
            id: listing.id,
            stock: listing.stock - 1,
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
    }

    //buy all stock
    //{
    // toast
    //   .promise(
    //     axios.post("/api/updateListing", {
    //       id: listing.id,
    //       userId: currentUser.id,
    //     }),
    //     {
    //       loading: "loading",
    //       success: "success",
    //       error: "failed",
    //     }
    //   )
    //   .finally(() => {
    //     setIsLoading(false);
    //   });}
    //}
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
              location={listing.location}
              imageSrc={listing.imageSrc}
              id={listing.id}
              user={user}
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
              onSubmit={onCreatePurchase}
              disabled={isLoading}
            />
            <div className="mt-5">
              <ListingMap location={listing.location} />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ListingClient;
