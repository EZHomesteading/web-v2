"use client";
//my listings page
import { toast } from "react-hot-toast";
import axios from "axios";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Heading from "@/app/components/Heading";
import Container from "@/app/components/Container";
import ListingCard from "@/app/components/listings/ListingCard";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { FinalListing } from "@/actions/getListings";
import { UserInfo } from "@/next-auth";

interface ListingsClientProps {
  listings: FinalListing[];
  user: UserInfo | null;
}

const ListingsClient: React.FC<ListingsClientProps> = ({ listings, user }) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState("");
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
    router.push(`/dashboard/my-store/update-listing/${id}`);
  };

  return (
    <div
      style={{ height: "100vh", overflow: "auto" }}
      className="pt-2 lg:pt-12"
    >
      <Container style={{ minHeight: "100%" }}>
        <div className="flex justify-between items-center">
          <Heading
            title="Products"
            subtitle="Modify your listings from this page"
          />
          <Link href="/dashboard/my-store/settings">
            <Button>Store Settings</Button>
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
          {listings.map((listing: FinalListing) => (
            <ListingCard
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
      </Container>
    </div>
  );
};

export default ListingsClient;
