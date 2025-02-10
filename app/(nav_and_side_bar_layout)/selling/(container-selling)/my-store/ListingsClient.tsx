"use client";
//my listings page
import axios from "axios";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Heading from "@/components/Heading";
import ListingCard from "@/components/listings/ListingCardDash";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FinalListing } from "@/actions/getListings";
import { AlertCircle } from "lucide-react";
import { UserInfo } from "next-auth";
import Toast from "@/components/ui/toast";

interface ListingsClientProps {
  canReceivePayouts: boolean;
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
  canReceivePayouts,
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
  const [viewListings, setViewListings] = useState(false);
  const [harvest, setHarvest] = useState(false);
  const onDelete = useCallback(
    (id: string) => {
      setDeletingId(id);

      axios
        .delete(`/api/listing/listings/${id}`)
        .then(() => {
          Toast({ message: "Listing deleted" });
          router.refresh();
        })
        .catch((error) => {
          Toast({ message: error?.response?.data?.error });
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
      {canReceivePayouts === false && viewListings === false ? (
        <div className="absolute inset-0 ">
          <div className="w-full flex flex-col justify-start  pt-12 sm:pt-24 px-6 sm:px-[10%]">
            <div className="bg-black/40 rounded-lg p-6 border border-gray-700 backdrop-blur-md">
              <div className="flex items-center gap-3 mb-6">
                <AlertCircle className="text-yellow-400 w-6 h-6" />
                <h2 className="text-xl font-semibold text-white">
                  Activate Your Store
                </h2>
              </div>

              <div className="mb-4">
                <Button
                  variant="outline"
                  className="hover:bg-yellow-400 hover:text-black transition-colors"
                  onClick={() => {
                    router.push("/stripe-setup");
                  }}
                >
                  Add Payout Information
                </Button>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                When setting up your store, your listings will remain inactive
                and hidden from the marketplace until you provide your payout
                information. This step ensures you're ready to receive payments
                securely and efficiently from customers. Payout information will
                only be required once.
              </p>

              <div className="flex justify-end border-t border-gray-700 pt-4">
                <Button
                  variant="secondary"
                  className="hover:bg-gray-700 transition-colors"
                  onClick={() => setViewListings(true)}
                >
                  View and Edit My Listings
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className=" px-5">
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

            <Link
              href="/dashboard/my-store/settings"
              className="md:w-48 w-full "
            >
              <Button className="md:w-48 mr-1 mb-1 w-full ">
                Store Settings
              </Button>
            </Link>
            {canReceivePayouts === false && (
              <Button
                className="md:w-48 mr-1 mb-1 w-full "
                onClick={() => {
                  router.push("/stripe-setup");
                }}
              >
                Add Payout Information
              </Button>
            )}
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
      )}
    </div>
  );
};

export default ListingsClient;
