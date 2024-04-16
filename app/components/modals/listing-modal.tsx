"use client";

import axios from "axios";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/app/components/ui/carousel";
import { toast } from "react-hot-toast";
import { useMemo, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { useRouter } from "next/navigation";
import SearchClient, {
  ProductValue,
} from "@/app/components/client/SearchClient";
import Heading from "@/app/components/Heading";
import useRentModal from "@/hooks/use-listing-modal";
import Modal from "@/app/components/modals/Modal";
import Input from "@/app/components/inputs/Input";
import { Label } from "@/app/components/ui/label";
import { PiStorefrontThin } from "react-icons/pi";
import Counter from "@/app/components/inputs/Counter";
import { Checkbox } from "@/app/components/ui/checkbox";
import { useCurrentUser } from "@/hooks/use-current-user";
import ImageUpload from "@/app/components/inputs/ImageUpload";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import LocationSearchInput from "@/app/components/map/LocationSearchInput";

enum STEPS {
  DESCRIPTION = 0,
  INFO = 1,
  IMAGES = 4,
  PRICE = 3,
  ORGANIC = 2,
  LOCATION = 5,
}

const ListingModal = () => {
  type AddressComponents = {
    street: string;
    city: string;
    state: string;
    zip: string;
  };

  const user = useCurrentUser();
  const [coopRating, setCoopRating] = useState(1);
  const [certificationChecked, setCertificationChecked] = useState(false);
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(STEPS.DESCRIPTION);
  const [quantityType, setQuantityType] = useState("");
  const [product, setProduct] = useState<ProductValue>();
  const router = useRouter();
  const rentModal = useRentModal();
  const [clicked, setClicked] = useState(false);

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
      location: "",
      stock: 1,
      quantityType: "",
      imageSrc: "",
      price: 1.5,
      title: "",
      description: "",
      shelfLifeDays: 0,
      shelfLifeWeeks: 0,
      shelfLifeMonths: 0,
      shelfLifeYears: 0,
      street: user?.location?.address[0],
      city: user?.location?.address[1],
      zip: user?.location?.address[3],
      state: user?.location?.address[2],
      coopRating: 1,
    },
  });

  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    isCertificationCheckbox = false
  ) => {
    const checked = event.target.checked;
    if (isCertificationCheckbox) {
      setCertificationChecked(checked);
      if (checked && coopRating === 1) {
        setCoopRating(2);
      }
    } else {
      let newRating = checked ? coopRating + 1 : coopRating - 1;
      newRating = Math.max(1, Math.min(newRating, 5));
      setCoopRating(newRating);
    }
  };

  const shelfLifeDays = watch("shelfLifeDays");
  const shelfLifeWeeks = watch("shelfLifeWeeks");
  const shelfLifeMonths = watch("shelfLifeMonths");
  const shelfLifeYears = watch("shelfLifeYears");
  const imageSrc = watch("imageSrc");
  const quantity = watch("stock");
  const price = watch("price");
  const description = watch("description");

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
    if (step === STEPS.DESCRIPTION && !product) {
      toast("Let us know what produce you have!", {
        duration: 2000,
        position: "bottom-right",
        style: {
          border: "2px solid #4CAF50",
          padding: "16px",
          color: "#4CAF50",
        },
        className:
          "flex items-center justify-between p-4 bg-green-500 text-white rounded-lg shadow-md",
        icon: "❓",
        ariaProps: {
          role: "status",
          "aria-live": "polite",
        },
      });
      return;
    }

    if (step === STEPS.DESCRIPTION && !description) {
      toast.error("Please write a brief description");
      return;
    }

    if (step === STEPS.INFO && !quantityType) {
      toast.error("Please enter a unit for your listing");
      return;
    }

    if (step === STEPS.INFO && (quantity <= 0 || !quantity)) {
      toast.error("Quantity must be greater than 0");
      return;
    }

    if (step === STEPS.IMAGES && !imageSrc) {
      toast.error("Please use the stock photo or upload a photo");
      return;
    }

    // if (step === STEPS.ORGANIC && !certificationChecked) {
    //   toast.error("You must certify that the above information is accurate.");
    //   return;
    // }

    if (
      step === STEPS.INFO &&
      shelfLifeDays <= 0 &&
      shelfLifeWeeks <= 0 &&
      shelfLifeMonths <= 0 &&
      shelfLifeYears <= 0
    ) {
      toast.error("Shelf life must be at least 1 day");
      return;
    }

    if (step === STEPS.PRICE && (price <= 0 || !quantity)) {
      toast.error("Please enter a price greater than 0.");
      return;
    }

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
      parseInt(data.shelfLifeMonths, 10) * 30 +
      parseInt(data.shelfLifeYears, 10) * 365;

    if (geoData) {
      const formData = {
        title: data.title,
        description: data.description,
        category: data.category,
        subCategory: data.subCategory,
        coopRating: data.coopRating,
        price: formattedPrice,
        imageSrc: data.imageSrc,
        stock: parseInt(data.stock, 10),
        shelfLife: shelfLife,
        quantityType: data.quantityType === "none" ? "" : data.quantityType,
        location: {
          type: "Point",
          coordinates: [geoData.lng, geoData.lat],
          address: [data.street, data.city, data.state, data.zip],
        },
      };
      axios

        .post("/api/listings", formData)
        .then(() => {
          toast.success("Listing created!");
          rentModal.onClose();
          setValue("category", "");
          setValue("subCategory", "");
          setValue("location", "");
          setValue("stock", 1);
          setValue("quantityType", "");
          setValue("imageSrc", "");
          setValue("price", 1.5);
          setValue("title", "");
          setValue("description", "");
          setValue("shelfLifeDays", 0);
          setValue("shelfLifeWeeks", 0);
          setValue("shelfLifeMonths", 0);
          setValue("shelfLifeYears", 0);
          setValue("street", "");
          setValue("city", "");
          setValue("zip", "");
          setValue("state", "");
          setValue("coopRating", 1);
          setProduct(undefined);
          setCoopRating(1);
          setStep(STEPS.DESCRIPTION);
          setCertificationChecked(false);
          setShowLocationInput(false);
          setQuantityType("");
        })
        .catch(() => {
          toast.error(
            "Please make sure you've added information for all of the fields."
          );
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
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
      <div>
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
      <div className="z-0">
        <Input
          id="description"
          label="Description"
          disabled={isLoading}
          register={register}
          errors={errors}
        />
      </div>
    </div>
  );

  if (step === STEPS.LOCATION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Where is your farm or garden located?"
          subtitle="Help local consumers find you!"
        />
        <div className="flex flex-row justify-evenly">
          <div className="flex flex-col justify-center">
            <PiStorefrontThin
              size="5em"
              className={
                clicked
                  ? "text-green-500 cursor-pointer"
                  : "cursor-pointer hover:text-green-500"
              }
              onClick={() => {
                setValue("address", "");
                setClicked(true);
              }}
            />
            Default Location
          </div>
          <div className="">
            <BiSearch
              size="5em"
              className="cursor-pointer hover:text-green-500"
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
    bodyContent = (
      <div className="flex flex-col gap-4">
        <Heading title="Share some basics about your product" subtitle="" />
        <div className="flex flex-row items-center gap-16 w-full">
          <div className="w-1/2">
            <Input
              id="stock"
              label="Quantity"
              type="number"
              disabled={isLoading}
              register={register}
              errors={errors}
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
            <div className="mb-3 text-sm">
              <Counter
                onChange={(value) => setCustomValue("shelfLifeYears", value)}
                value={shelfLifeYears}
                title="Years"
                subtitle=""
              />
            </div>
          </Label>
        </div>
      </div>
    );
  }

  if (step === STEPS.IMAGES) {
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

  if (step === STEPS.ORGANIC) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Tell us about how you grow your produce"
          subtitle="Select all that apply to increase your EZH Organic Rating!"
        />
        <div className="flex flex-col gap-y-2">
          <div className="flex flex-row gap-x-2 items-center">
            <Checkbox
            // onChange={(e) => handleCheckboxChange(e)}
            />
            <Label>This produce is not genetically modified</Label>
          </div>
          <div className="flex flex-row gap-x-2 items-center">
            <Checkbox
            // onChange={(e) => handleCheckboxChange(e)}
            />
            <Label>This produce was not grown with inorganic fertilizers</Label>
          </div>
          <div className="flex flex-row gap-x-2 items-center">
            <Checkbox
            // onChange={(e) => handleCheckboxChange(e)}
            />
            <Label>This produce was not grown with inorganic pestacides</Label>
          </div>
          <div className="flex flex-row gap-x-2 items-center">
            <Checkbox
            // onChange={(e) => handleCheckboxChange(e)}
            />
            <Label>This produce was not modified after harvest</Label>
          </div>
          <div className="flex flex-row gap-x-2 font-extrabold items-center">
            <Checkbox
            // onChange={(e) => handleCheckboxChange(e, true)}
            />
            <Label className="font-bold">
              I certify that all of the above information is accurate
            </Label>
          </div>
        </div>
      </div>
    );
  }

  if (step === STEPS.PRICE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Now, set your price"
          subtitle="How much do you charge per unit? This isn't your total price unless you only have one."
        />
        <div>
          <Input
            id="price"
            label="Price per unit"
            type="number"
            step="0.01"
            disabled={isLoading}
            register={register}
            errors={errors}
            formatPrice
          />
        </div>
      </div>
    );
  }

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

export default ListingModal;
