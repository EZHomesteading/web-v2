"use client";

import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Container from "@/app/components/Container";

import Input from "@/app/components/inputs/Input";
import Heading from "@/app/components/Heading";
import { Button } from "@/app/components/ui/button";
import { SafeListing } from "@/types";
import { useRouter } from "next/navigation";
import ImageUpload from "@/app/components/inputs/ImageUpload";

interface UpdateListingProps {
  listing: SafeListing;
}

const UpdateClient = ({ listing }: UpdateListingProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      id: listing?.id,
      description: listing?.description,
      title: listing?.title,
      stock: listing?.stock,
      price: listing?.price,
      shelfLife: listing?.shelfLife,
      imageSrc: listing?.imageSrc,
      category: listing?.category,
      quantityType: listing?.quantityType,
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    const formData = {
      ...data,
      stock: parseInt(data.stock),
      shelfLife: parseInt(data.shelfLife),
      price: parseFloat(data.price),
    };
    axios
      .post("/api/updateListing", formData)
      .then(() => {
        toast.success("Your Listing was Updated!");
      })
      .catch((error) => {
        toast.error(error);
      })
      .finally(() => {
        setIsLoading(false);
        router.push("/");
      });
  };

  return (
    <Container>
      <div className="flex flex-row gap-4">
        <div className="w-1/2">
          <Heading
            title="Update Your Listing"
            subtitle={`Modify the details for your ${listing?.title} here`}
          />
        </div>
        <div className="flex flex-col gap-y-2">
          <Input
            id="stock"
            label="Stock"
            disabled={isLoading}
            register={register}
            errors={errors}
          />

          <Input
            id="price"
            label="Price"
            disabled={isLoading}
            register={register}
            errors={errors}
          />

          <Input
            id="description"
            label="Description"
            disabled={isLoading}
            register={register}
            errors={errors}
          />
          <Input
            id="shelfLife"
            label="Shelf Life"
            disabled={isLoading}
            register={register}
            errors={errors}
          />
          <ImageUpload value={listing?.imageSrc} onChange={() => {}} />
          <Button onClick={handleSubmit(onSubmit)}>Update</Button>
        </div>
      </div>
    </Container>
  );
};

export default UpdateClient;
