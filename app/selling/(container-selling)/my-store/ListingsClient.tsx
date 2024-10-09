"use client";
//my listings page
import { toast } from "react-hot-toast";
import axios from "axios";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Heading from "@/app/components/Heading";
import Container from "@/app/components/Container";
import ListingCard from "@/app/components/listings/ListingCardDash";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { FinalListing } from "@/actions/getListings";
import { UserInfo } from "@/next-auth";

interface ListingsClientProps {
  listings: FinalListing[];
  user: UserInfo | null;
  orderQuantities: {
    listingId: any;
    totalQuantity: any;
  }[];
}

const ListingsClient: React.FC<ListingsClientProps> = ({
  listings,
  user,
  orderQuantities,
}) => {
  // Function to filter out listings with harvestFeatures set to true
  function filterOutHarvestFeatures(listings: FinalListing[]): FinalListing[] {
    return listings.filter((listing) => !listing.harvestFeatures);
  }

  // Function to return only listings with harvestFeatures set to true
  function getOnlyHarvestFeatures(listings: FinalListing[]): FinalListing[] {
    return listings.filter((listing) => listing.harvestFeatures);
  }

  const activeListings = filterOutHarvestFeatures(listings);
  const projectedListings = getOnlyHarvestFeatures(listings);
  const router = useRouter();
  const [deletingId, setDeletingId] = useState("");
  const [listingMap, setListingMap] = useState(activeListings);
  const [harvest, setHarvest] = useState(false);
  const onDelete = useCallback(
    (id: string) => {
      setDeletingId(id);

      axios
        .delete(`/api/listing/listings/${id}`)
        .then(() => {
          toast.success("Listing deleted");
          router.refresh();
        })
        .catch((error) => {
          toast.error(error?.response?.data?.error);
        })
        .finally(() => {
          setDeletingId("");
        });
    },
    [router]
  );

  const onEdit = (id: string) => {
    id;
    router.push(`/selling/update-listing/${id}`);
  };

  return (
    <div style={{ height: "100vh", overflow: "auto" }} className="">
      <div className="flex-none ">
        <Heading
          title="My Listings"
          subtitle="Modify your listings from this page"
        />
        <Button
          onClick={() => {
            harvest
              ? setListingMap(activeListings)
              : setListingMap(projectedListings);
            harvest ? setHarvest(false) : setHarvest(true);
          }}
          className="w-full md:w-48 mr-1 mb-1"
        >
          {harvest ? "Show Active Listings" : "Show Projected Listings"}
        </Button>
        <Link href="/dashboard/my-store/settings" className="md:w-48 w-full ">
          <Button className="md:w-48 w-full ">Store Settings</Button>
        </Link>
      </div>

      <div
        className="
          mt-2
          lg:mt-4
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
        {listingMap.map((listing: FinalListing) => (
          <ListingCard
            orderQuantities={orderQuantities}
            review={listing.review}
            key={listing.id}
            data={listing}
            actionId={listing.id}
            onAction={onDelete}
            disabled={deletingId === listing.id}
            actionLabel="Delete"
            secondActionId={listing.id}
            secondActionLabel="Edit"
            onSecondAction={onEdit}
            user={user}
            storeUser={user as unknown as UserInfo}
          />
        ))}
      </div>
    </div>
  );
};

export default ListingsClient;
