"use client";
// Import necessary modules and components

// make radiogroup data go where its supposed to

import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { FullListing } from "@/types";
import Container from "@/app/components/Container";
// import getCurrentUser from "@/app/actions/getCurrentUser";

import Input from "@/app/components/inputs/Input";
import Heading from "@/app/components/Heading";
import { Button } from "@/app/components/ui/button";
import { $Enums, Prisma } from "@prisma/client";
// const currentUser = getCurrentUser();

interface UpdateUserProps {
  currentUser: any;
}

// Define RegisterModal component
const UpdateClient: React.FC<UpdateUserProps> = ({ currentUser }) => {
  // Hooks for managing state and form data
  const [isLoading, setIsLoading] = useState(false);

  // Form control using react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      id: currentUser?.id,
      description: currentUser?.description,
      title: currentUser?.title,
      stock: currentUser?.stock,
      price: currentUser?.price,
      shelfLife: currentUser?.shelfLife,
      imageSrc: currentUser?.imageSrc,
      category: currentUser?.category,
      quantityType: currentUser?.quantityType,
    },
  });

  // Function to handle form submission
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    const formData = {
      ...data,
      stock: parseInt(data.stock),
      shelfLife: parseInt(data.shelfLife),
      price: parseFloat(data.price),
    };
    // Send registration data to the backend
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

  // JSX content for the modal body
  return (
    <Container>
      <div className="flex flex-col gap-4">
        <Heading
          title="Update The Listings Info Below"
          subtitle={`enter details for ${currentUser?.title} below`}
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

// Export the RegisterModal component
export default UpdateClient;
