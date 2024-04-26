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

interface UpdateUserProps {
  listing: SafeListing;
}

const UpdateClient: React.FC<UpdateUserProps> = ({ listing }) => {
  const [isLoading, setIsLoading] = useState(false);

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
        toast.success("Updated!");
      })
      .catch((error) => {
        toast.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Container>
      <div className="flex flex-col gap-4">
        <Heading
          title="Update The Listings Info Below"
          subtitle={`enter details for ${listing?.title} below`}
        />

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
      </div>
      <div className="flex flex-col gap-4 mt-3">
        <div className="text-neutral-500 text-center mt-4 font-light">
          <Button
            onClick={handleSubmit(onSubmit)}
            className="text-neutral-800 cursor-pointer hover:underline"
          >
            SUBMIT
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default UpdateClient;
