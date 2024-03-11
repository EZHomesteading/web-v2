"use client";

import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Container from "@/app/components/Container";
import Input from "../../app/components/inputs/Input";
import Heading from "../../app/components/Heading";
import { Button } from "../../app/components/ui/button";
import { SafeListing } from "@/app/types";

interface UpdateListingProps {
  currentListing?: SafeListing | null;
}

// Define RegisterModal component
const UpdateClient: React.FC<UpdateListingProps> = ({ currentListing }) => {
  // Hooks for managing state and form data
  const [isLoading, setIsLoading] = useState(false);

  // Form control using react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      id: currentListing?.id,
      category: currentListing?.category,
      stock: currentListing?.stock,
      quantityType: currentListing?.quantityType,
      price: currentListing?.price,
      imageSrc: currentListing?.imageSrc,
      description: currentListing?.description,
      shelfLife: currentListing?.shelfLife,
    },
  });

  // Function to handle form submission
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    const formattedPrice = parseFloat(parseFloat(data.price).toFixed(2));
    const shelfLife =
      parseInt(data.shelfLifeDays, 10) +
      parseInt(data.shelfLifeWeeks, 10) * 7 +
      parseInt(data.shelfLifeMonths, 10) * 30;

    const formData = {
      ...data,
      stock: parseInt(data.stock, 10), // Ensure stock is an integer
      shelfLife,
      price: formattedPrice,
      quantityType: data.quantityType === "none" ? "" : data.quantityType,
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
        <Heading title="Update your Listing" subtitle="enter details below" />

        <Input
          id="category"
          label="Category"
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
          id="stock"
          label="Stock"
          disabled={isLoading}
          register={register}
          errors={errors}
        />

        <Input
          id="quantityType"
          label="Units"
          disabled={isLoading}
          register={register}
          errors={errors}
        />
      </div>
      <div className="flex flex-col gap-4 mt-3">
        <div className="text-neutral-500 text-center mt-4 font-light">
          <Button
            onClick={handleSubmit(onSubmit)}
            className="text-neutral-800 cursor-pointer"
          >
            Submit
          </Button>
        </div>
      </div>
    </Container>
  );
};

// Export the RegisterModal component
export default UpdateClient;
