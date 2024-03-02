"use client";

// Import necessary dependencies
import axios from "axios";
import dynamic from "next/dynamic"; // Dynamic import for Map component
import useRentModal from "@/app/hooks/useRentModal"; // Custom hook for modal
import Modal from "./Modal"; // Modal component
import Counter from "../inputs/Counter"; // Input component for counters
import CategoryInput from "../inputs/CategoryInput"; // Input component for categories
import CountrySelect from "../inputs/CountrySelect"; // Input component for selecting country
import ImageUpload from "../inputs/ImageUpload"; // Input component for image upload
import Input from "../inputs/Input"; // Generic input component
import Heading from "../Heading"; // Custom heading component

import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation"; // Navigation hook from Next.js
import { useTheme } from "next-themes";
import { categories } from "../navbar/Categories"; // List of categories
import { Label } from "../ui/label";
import { useMemo, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel"; // Carousel UI components

// Enum representing steps of the form
enum STEPS {
  DESCRIPTION = 0,
  CATEGORY = 1,
  INFO = 2,
  IMAGES = 3,
  PRICE = 4,
  LOCATION = 5,
}

// RentModal component definition
const RentModal = () => {
  const { theme } = useTheme();

  // Determine the color of input fields based on the theme
  const inputColor = theme === "dark" ? "#222222" : "#222222";
  // Next.js router
  const router = useRouter();
  // Custom hook for modal state
  const rentModal = useRentModal();

  // State variables
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [step, setStep] = useState(STEPS.DESCRIPTION); // Current step in the form
  const [quantityType, setQuantityType] = useState(""); // Add this line to manage categoryType state

  // Existing useForm hook and other setup code

  // Function to handle click on carousel item
  const handleCarouselItemClick = (word: string) => {
    setQuantityType(word); // Update the categoryType state with the selected word
    setValue("quantityType", word, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  // React Hook Form hook for form management
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    // Default values for form fields
    defaultValues: {
      category: "",
      location: null,
      stock: "1",
      quantityType: "",
      imageSrc: "",
      price: 1,
      title: "",
      description: "",
      shelfLifeDays: 0,
      shelfLifeWeeks: 0,
      shelfLifeMonths: 0,
    },
  });

  // Watched form fields
  const location = watch("location");
  const category = watch("category");
  const shelfLifeDays = watch("shelfLifeDays");
  const shelfLifeWeeks = watch("shelfLifeWeeks");
  const shelfLifeMonths = watch("shelfLifeMonths");
  const imageSrc = watch("imageSrc");

  // Dynamically loaded Map component based on location
  const Map = useMemo(
    () =>
      dynamic(() => import("../Map"), {
        ssr: false,
      }),
    [location]
  );

  // Function to set custom form values
  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  // Function to handle back action
  const onBack = () => {
    setStep((value) => value - 1);
  };

  // Function to handle next action
  const onNext = () => {
    setStep((value) => value + 1);
  };

  // Form submission handler
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    // If not at the final step, proceed to the next step
    if (step !== STEPS.LOCATION) {
      return onNext();
    }

    // If at the final step, submit the form
    setIsLoading(true);

    const formattedPrice = parseFloat(parseFloat(data.price).toFixed(2));
    const shelfLife =
      parseInt(data.shelfLifeDays, 10) +
      parseInt(data.shelfLifeWeeks, 10) * 7 +
      parseInt(data.shelfLifeMonths, 10) * 30;

    console.log("Calculated shelfLife:", shelfLife);
    console.log("formattedPrice: ", formattedPrice);
    const formData = {
      ...data,
      stock: parseInt(data.stock, 10), // Ensure stock is an integer
      shelfLife,
      price: formattedPrice,
    };

    // Submit form data via axios
    axios
      .post("/api/listings", formData)
      .then(() => {
        toast.success("Listing created!"); // Display success message
        router.refresh(); // Refresh the page
        reset(); // Reset form fields
        setStep(STEPS.DESCRIPTION); // Reset to first step
        rentModal.onClose(); // Close the modal
      })
      .catch(() => {
        toast.error("Something went wrong."); // Display error message
      })
      .finally(() => {
        setIsLoading(false); // Reset loading state
      });
  };

  // Determine label for primary action button based on current step
  const actionLabel = useMemo(() => {
    if (step === STEPS.LOCATION) {
      return "Create";
    }

    return "Next";
  }, [step]);

  // Determine label for secondary action button based on current step
  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.DESCRIPTION) {
      return undefined;
    }

    return "Back";
  }, [step]);

  // Determine body content based on current step
  let bodyContent = (
    <div className="flex flex-col gap-8">
      {/* Form fields for describing the product */}
      <Heading
        title="How would you describe your product?"
        subtitle="Short and sweet works best!"
      />
      <div style={{ color: inputColor }}>
        <Input
          id="title"
          label="Title"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
      <hr />
      <div style={{ color: inputColor }}>
        <Input
          id="description"
          label="Description"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    </div>
  );

  // Render different content based on step
  if (step === STEPS.LOCATION) {
    // Form fields for specifying location
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Where is your farm or garden located?"
          subtitle="Help local consumers find you!"
        />
        <div style={{ color: inputColor }}>
          <CountrySelect
            value={location}
            onChange={(value) => setCustomValue("location", value)}
          />
        </div>
        <Map center={location?.latlng} />
      </div>
    );
  }

  if (step === STEPS.INFO) {
    // Form fields for providing basic information about the product
    bodyContent = (
      <div className="flex flex-col gap-4">
        <Heading title="Share some basics about your product" subtitle="" />
        <div className="flex flex-row items-center gap-16 w-full">
          <div style={{ color: inputColor }} className="w-1/2">
            <Input
              id="stock"
              label="Quantity"
              type="number"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
            />
          </div>
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-1/3"
          >
            <CarouselContent>
              {/* Render items in carousel */}
              {[
                "pounds",
                "oz",
                "none",
                "kilograms",
                "grams",
                "bushel",
                "dozen",
                "carton",
                "",
              ].map((word, index) => (
                <CarouselItem
                  key={index}
                  className="md:basis-1/2 lg:basis-1/3 "
                >
                  <div
                    className="flex items-center justify-center p-3 hover:cursor-pointer"
                    onClick={() => handleCarouselItemClick(word)}
                  >
                    <span
                      className={`text-md ${
                        quantityType === word ? "font-bold text-green-300" : ""
                      }`}
                    >
                      {word}
                    </span>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        <hr />
        {/* shelfLife =  shelfLifeDays + shelfLifeWeeks*7 + shelfLifeMonths*30 */}
        <div className="mb-3">
          <Label className="text-lg">
            Estimated Shelf Life
            <div className="mb-3 text-sm">
              <Counter
                onChange={(value) => setCustomValue("shelfLifeDays", value)}
                value={shelfLifeDays}
                title="Days"
                subtitle=""
              />
            </div>
            <div className="mb-3 text-sm">
              <Counter
                onChange={(value) => setCustomValue("shelfLifeWeeks", value)}
                value={shelfLifeWeeks}
                title="Weeks"
                subtitle=""
              />
            </div>
            <div className="mb-3 text-sm">
              <Counter
                onChange={(value) => setCustomValue("shelfLifeMonths", value)}
                value={shelfLifeMonths}
                title="Months"
                subtitle=""
              />
            </div>
          </Label>
        </div>
      </div>
    );
  }

  if (step === STEPS.IMAGES) {
    // Form fields for uploading images
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Add a photo of your product"
          subtitle="Show consumers what your product looks like!"
        />
        <ImageUpload
          onChange={(value) => setCustomValue("imageSrc", value)}
          value={imageSrc}
        />
      </div>
    );
  }

  if (step === STEPS.CATEGORY) {
    // Form fields for selecting category
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Which of these best describes your product?"
          subtitle="Pick a category"
        />
        <div
          className="
          grid 
          grid-cols-1 
          md:grid-cols-2 
          gap-3
          max-h-[50vh]
          overflow-y-auto
          z-10
        "
        >
          {/* Render category options */}
          {categories.map((item) => (
            <div key={item.label} className="col-span-1">
              <CategoryInput
                onClick={(category) => setCustomValue("category", category)}
                selected={category === item.label}
                label={item.label}
                icon={item.icon}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (step === STEPS.PRICE) {
    // Form fields for setting price
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Now, set your price"
          subtitle="How much do you charge per unit? This isn't your total price unless you only have one."
        />
        <div style={{ color: inputColor }}>
          <Input
            id="price"
            label="Price per unit"
            type="number"
            step="0.01"
            disabled={isLoading}
            register={register}
            errors={errors}
            formatPrice
            required
          />
        </div>
      </div>
    );
  }

  // Return Modal component with appropriate props
  return (
    <Modal
      disabled={isLoading}
      isOpen={rentModal.isOpen}
      title="Sell your produce & self sufficiency items!"
      actionLabel={actionLabel}
      onSubmit={handleSubmit(onSubmit)}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.DESCRIPTION ? undefined : onBack}
      onClose={rentModal.onClose}
      body={bodyContent}
    />
  );
};

export default RentModal; // Export RentModal component
