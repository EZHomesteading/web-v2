"use client";

import { toast } from "react-hot-toast";
import axios from "axios";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { SafeListing } from "@/types";

import Heading from "@/app/components/Heading";
import Container from "@/app/components/Container";
import ListingCard from "@/app/components/listings/ListingCard";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";

interface PropertiesClientProps {
  listings: {
    id: string;
    imageSrc: string[];
    location: any;
    price: number;
    title: string;
    quantityType: string;
  }[];
  user?: any | null;
}

const PropertiesClient: React.FC<PropertiesClientProps> = ({
  listings,
  user,
}) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState("");

  const onDelete = useCallback(
    (id: string) => {
      setDeletingId(id);

      axios
        .delete(`/api/listings/${id}`)
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
            <Button>My Co-op Settings</Button>
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
          {listings.map((listing) => (
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
            />
          ))}
        </div>
      </Container>
    </div>
  );
};

export default PropertiesClient;
