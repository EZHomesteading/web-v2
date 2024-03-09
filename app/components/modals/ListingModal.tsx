"use client";

import axios from "axios";
import useRentModal from "@/app/hooks/useRentModal";
import Modal from "./Modal";
import Counter from "../inputs/Counter";
import ImageUpload from "../inputs/ImageUpload";
import Input from "../inputs/Input";
import Heading from "../Heading";
import SearchClient, { ProductValue } from "@/app/search/SearchClient";
import { BiSearch } from "react-icons/bi";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Label } from "../ui/label";
import { useMemo, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import LocationSearchInput from "../map/LocationSearchInput";
import { PiStorefrontThin } from "react-icons/pi";

enum STEPS {
  DESCRIPTION = 0,
  INFO = 1,
  IMAGES = 2,
  PRICE = 3,
  LOCATION = 4,
}

const ListingModal = () => {
  type AddressComponents = {
    street: string;
    city: string;
    state: string;
    zip: string;
  };

  const [product, setProduct] = useState<ProductValue>();
  const { theme } = useTheme();
  const inputColor = theme === "dark" ? "#222222" : "#222222";
  const router = useRouter();
  const rentModal = useRentModal();

  const [showLocationInput, setShowLocationInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(STEPS.DESCRIPTION);
  const [quantityType, setQuantityType] = useState("");

  const toggleLocationInput = () => {
    setShowLocationInput(!showLocationInput);
  };

  const handleCarouselItemClick = (word: string) => {
    setQuantityType(word);
    setValue("quantityType", word, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  let {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      category: "",
      subCategory: "",
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
      street: "",
      city: "",
      zip: "",
      state: "",
    },
  });

  const shelfLifeDays = watch("shelfLifeDays");
  const shelfLifeWeeks = watch("shelfLifeWeeks");
  const shelfLifeMonths = watch("shelfLifeMonths");
  const imageSrc = watch("imageSrc");

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onNext = () => {
    setStep((value) => value + 1);
  };

  const getLatLngFromAddress = async (address: string) => {
    const apiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      if (response.data.status === "OK") {
        const { lat, lng } = response.data.results[0].geometry.location;

        console.log(`Address: ${address}, Latitude: ${lat}, Longitude: ${lng}`);

        return { lat, lng };
      } else {
        throw new Error("Geocoding failed");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (step !== STEPS.LOCATION) {
      return onNext();
    }

    setIsLoading(true);

    const fullAddress = `${data.street}, ${data.city}, ${data.state}, ${data.zip}`;
    const geoData = await getLatLngFromAddress(fullAddress);

    const formattedPrice = parseFloat(parseFloat(data.price).toFixed(2));
    const shelfLife =
      parseInt(data.shelfLifeDays, 10) +
      parseInt(data.shelfLifeWeeks, 10) * 7 +
      parseInt(data.shelfLifeMonths, 10) * 30;

    if (geoData) {
      const formData = {
        ...data,
        stock: parseInt(data.stock, 10),
        shelfLife,
        price: formattedPrice,
        quantityType: data.quantityType === "none" ? "" : data.quantityType,
        location: {
          type: "Point",
          coordinates: [geoData.lng, geoData.lat],
        },
      };

      axios
        .post("/api/listings", formData)
        .then(() => {
          toast.success("Listing created!");
          router.refresh();
          reset();
          setStep(STEPS.DESCRIPTION);
          reset;
          rentModal.onClose();
        })
        .catch(() => {
          toast.error(
            "Please make sure you've added information for all of the fields."
          );
        })
        .finally(() => {
          setIsLoading(false); // Reset loading state
        });
    } else {
      // Handle geocoding failure
      setIsLoading(false);
      toast.error("Please select or enter a valid address.");
    }
  };

  const handleAddressSelect = ({
    street,
    city,
    state,
    zip,
  }: AddressComponents) => {
    setValue("street", street);
    setValue("city", city);
    setValue("state", state);
    setValue("zip", zip);
  };

  const actionLabel = useMemo(() => {
    if (step === STEPS.LOCATION) {
      return "Create";
    }

    return "Next";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.DESCRIPTION) {
      return undefined;
    }

    return "Back";
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="How would you describe your product?"
        subtitle="Short and sweet works best!"
      />
      <div style={{ color: inputColor }}>
        <SearchClient
          value={product}
          onChange={(value) => {
            setProduct(value as ProductValue);
            setValue("title", value?.label);
            setValue("category", value?.category);
            setValue("imageSrc", value?.photo);
            setValue("subCategory", value?.cat);
          }}
        />
      </div>
      <hr />
      <div style={{ color: inputColor }} className="z-0">
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
        <div className="flex flex-row justify-evenly">
          <div className="">
            <PiStorefrontThin size="5em" className=" hover:cursor-pointer" />
            Default Location
          </div>
          <div className="">
            <BiSearch
              size="5em"
              className=""
              onClick={toggleLocationInput}
              style={{ cursor: "pointer" }}
            />
            Different Location
          </div>
        </div>
      </div>
    );
  }

  if (showLocationInput) {
    bodyContent = (
      <>
        <div className="flex flex-col gap-8">
          <Heading
            title="Where is your farm or garden located?"
            subtitle="Help local consumers find you!"
          />
          <div className="flex flex-row justify-center space-x-4">
            <PiStorefrontThin size="5em" className="w-1/2" />
            <BiSearch
              size="5em"
              className="w-1/2"
              onClick={toggleLocationInput}
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <LocationSearchInput
            address={watch("address")}
            setAddress={(address) => setValue("address", address)}
            onAddressParsed={handleAddressSelect}
          />
        </div>
      </>
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
              {[
                "lb",
                "oz",
                "none",
                "kg",
                "gram",
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

export default ListingModal; // Export RentModal component
