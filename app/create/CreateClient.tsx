"use client";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { IoReturnDownBack, IoReturnDownForward } from "react-icons/io5";
import { UserInfo } from "@/next-auth";
import { CiCircleInfo } from "react-icons/ci";
import { ExtendedHours } from "@/next-auth";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import { Button } from "@/app/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/app/components/ui/breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";

import axios from "axios";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { useRouter } from "next/navigation";
import SearchClient, {
  ProductValue,
} from "@/app/components/client/SearchClient";
import Heading from "@/app/components/Heading";

import Input from "@/app/components/inputs/Input";
import { Label } from "@/app/components/ui/label";
import { PiStorefrontThin } from "react-icons/pi";
import Counter from "@/app/components/inputs/Counter";
import { Checkbox } from "@/app/components/ui/checkbox";
import LocationSearchInput from "@/app/components/map/LocationSearchInput";
import { UploadButton } from "@/utils/uploadthing";
import { Outfit, Zilla_Slab } from "next/font/google";
import Image from "next/image";

import { BsBucket } from "react-icons/bs";
import UnitSelect, { QuantityTypeValue } from "./components/UnitSelect";
const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});
interface Props {
  user: UserInfo;
  index: number;
}
const CreateClient = ({ user, index }: Props) => {
  type AddressComponents = {
    street: string;
    city: string;
    state: string;
    zip: string;
  };

  const [coopRating, setCoopRating] = useState(1);
  const [certificationChecked, setCertificationChecked] = useState(false);
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(index);
  const [quantityType, setQuantityType] = useState<QuantityTypeValue>();
  const [product, setProduct] = useState<ProductValue>();
  const router = useRouter();

  const [clicked, setClicked] = useState(false);
  const [c, setC] = useState(false);

  const toggleLocationInput = () => {
    setShowLocationInput(!showLocationInput);
  };

  let {
    register,
    setValue,
    handleSubmit,
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
      imageSrc: [],
      price: 1.5,
      title: "",
      description: "",
      shelfLifeDays: 0,
      shelfLifeWeeks: 0,
      shelfLifeMonths: 0,
      shelfLifeYears: 0,
      street: "",
      city: "",
      zip: "",
      state: "",
      coopRating: 1,
      minOrder: 1,
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
  const minOrder = watch("minOrder");
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

  const [imageStates, setImageStates] = useState(
    [...Array(3)].map(() => ({
      isHovered: false,
      isFocused: false,
    }))
  );

  const handleMouseEnter = (index: number) => {
    setImageStates((prevStates) =>
      prevStates.map((state, i) =>
        i === index ? { ...state, isHovered: true } : state
      )
    );
  };

  const handleMouseLeave = (index: number) => {
    setImageStates((prevStates) =>
      prevStates.map((state, i) =>
        i === index ? { ...state, isHovered: false } : state
      )
    );
  };

  const handleClick = (index: number) => {
    setImageStates((prevStates) =>
      prevStates.map((state, i) =>
        i === index ? { ...state, isFocused: !state.isFocused } : state
      )
    );
  };
  let defaultHours;
  if (user?.hours) {
    defaultHours = user?.hours;
  } else {
    defaultHours = {
      0: [{ open: 480, close: 1020 }],
      1: [{ open: 480, close: 1020 }],
      2: [{ open: 480, close: 1020 }],
      3: [{ open: 480, close: 1020 }],
      4: [{ open: 480, close: 1020 }],
      5: [{ open: 480, close: 1020 }],
      6: [{ open: 480, close: 1020 }],
    };
  }
  const onSubmit: SubmitHandler<FieldValues> = async (data: any) => {
    setIsLoading(true);

    const fullAddress = `${data.street}, ${data.city}, ${data.state}, ${data.zip}`;
    console.log(user);
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
        minOrder: data.minOrder,
        description: data.description,
        category: data.category,
        subCategory: data.subCategory,
        coopRating: data.coopRating,
        price: formattedPrice,
        imageSrc: data.imageSrc,
        stock: parseInt(data.stock, 10),
        shelfLife: shelfLife,
        quantityType:
          data.quantityType === "none" || data.quantityType === "each"
            ? ""
            : data.quantityType,
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
          setValue("minOrder", 1);
          setC(false);
          setClicked(false);
          setProduct(undefined);
          setCoopRating(1);
          setCertificationChecked(false);
          setShowLocationInput(false);
          setQuantityType(undefined);
        })
        .catch(() => {
          toast.error(
            "Please make sure you've added information for all of the fields."
          );
        })
        .finally(() => {
          setIsLoading(false);
          router.push("/dashboard/my-store");
        });
    } else {
      setIsLoading(false);
      toast.error("Please select or enter a valid address.");
    }
  };
  const [coOpHours, setCoOpHours] = useState<ExtendedHours>(defaultHours);
  const handleNext = async () => {
    if (step === 1 && !product) {
      toast.error("Let us know what produce you have!", {
        duration: 2000,
        position: "bottom-right",
      });
      return;
    }

    if (step === 1 && !description) {
      toast.error("Please write a brief description");
      return;
    }

    if (step === 2 && !quantityType) {
      toast.error("Please enter a unit for your listing");
      return;
    }

    if (step === 2 && (quantity <= 0 || !quantity)) {
      toast.error("Quantity must be greater than 0");
      return;
    }

    if (step === 5 && Array.isArray(imageSrc) && imageSrc.length === 0) {
      toast.error("Please use the stock photo or upload atleast one photo");
      return;
    }

    // if (step === STEPS.ORGANIC && !certificationChecked) {
    //   toast.error("You must certify that the above information is accurate.");
    //   return;
    // }

    if (
      step === 2 &&
      shelfLifeDays <= 0 &&
      shelfLifeWeeks <= 0 &&
      shelfLifeMonths <= 0 &&
      shelfLifeYears <= 0
    ) {
      toast.error("Shelf life must be at least 1 day");
      return;
    }

    if (step === 2 && (price <= 0 || !quantity)) {
      toast.error("Please enter a price greater than 0.");
      return;
    }
    if (step === 2 && (minOrder <= 0 || !quantity)) {
      toast.error("Please enter a minimum order greater than 0.");
      return;
    }
    if (step === 5) {
      if (!product) {
        toast.error("Let us know what produce you have!", {
          duration: 2000,
          position: "bottom-right",
        });
        return;
      } else if (!description) {
        toast.error("Please write a brief description");
        return;
      } else if (!quantityType) {
        toast.error("Please enter a unit for your listing");
        return;
      } else if (quantity <= 0 || !quantity) {
        toast.error("Quantity must be greater than 0");
        return;
      } else if (minOrder <= 0 || !quantity) {
        toast.error("Please enter a minimum order greater than 0.");
        return;
      } else if (Array.isArray(imageSrc) && imageSrc.length === 0) {
        toast.error("Please use the stock photo or upload at least one photo");
        return;
      }

      // if (step === STEPS.ORGANIC && !certificationChecked) {
      //   toast.error("You must certify that the above information is accurate.");
      //   return;
      // }
      else if (
        shelfLifeDays <= 0 &&
        shelfLifeWeeks <= 0 &&
        shelfLifeMonths <= 0 &&
        shelfLifeYears <= 0
      ) {
        toast.error("Shelf life must be at least 1 day");
        return;
      } else if (price <= 0 || !quantity) {
        toast.error("Please enter a price greater than 0.");
        return;
      }
    }
    if (step === 6) {
      handleSubmit(onSubmit)();

      //router.push("/dashboard/my-store");
    } else {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };
  useEffect(() => {
    if (quantity <= 0) {
      setValue("stock", 1);
    }
    if (minOrder <= 0) {
      setValue("minOrder", 1);
    }
  }),
    [quantity, minOrder];

  return (
    <div className="h-screen">
      <div className="flex flex-col md:flex-row text-black">
        <div className="onboard-left md:w-2/5">
          <div className="flex flex-col items-start pl-12 py-5 lg:py-20 ">
            <h2 className="tracking font-medium 2xl:text-2xl text-lg tracking-tight md:pt-[20%]">
              Create Your New Listing
            </h2>
            {step === 1 && (
              <div className="flex flex-row">
                <div className="2xl:text-4xl text-lg font-bold tracking-tight">
                  Tell us about the Product
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="flex flex-row items-center">
                {" "}
                <div className="2xl:text-5xl text-lg font-bold tracking-tight flex">
                  Share some basics about your product
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="flex flex-col items-start">
                <div className="flex flex-row">
                  <div className="2xl:text-3xl text-lg font-bold tracking-tight">
                    Tell us how you grow your produce
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button className="shadow-none bg-transparent hover:bg-transparent text-black">
                        <CiCircleInfo className="lg:text-4xl" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="popover xl:absolute xl:bottom-10">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            EZHomesteading will periodically test certain farms
                            foodstuffs to ensure the validity of these claims.
                          </p>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="shadow-none bg-transparent hover:bg-transparent text-black m-0 p-0 text-xs">
                  Select all that apply to increase your EZH Organic Rating
                </div>
              </div>
            )}
            {step === 4 && (
              <div className="flex flex-col items-start">
                <div className="flex flex-row">
                  <div className="2xl:text-3xl text-lg font-bold tracking-tight">
                    Set up your store hours If you haven't already.
                  </div>
                </div>
              </div>
            )}
            {step === 5 && (
              <div className="flex flex-col items-start">
                <div className="flex flex-row">
                  <div className="2xl:text-3xl text-lg font-bold tracking-tight">
                    Add a photo
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button className="shadow-none bg-transparent hover:bg-transparent text-black">
                        <CiCircleInfo className="lg:text-4xl" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="popover xl:absolute xl:bottom-10">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            EZHomesteading reccomends that Producers upload at
                            least one photo of their actual product.
                          </p>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="shadow-none bg-transparent hover:bg-transparent text-black m-0 p-0 text-xs">
                  Feel free to include, only use, or get rid of the stock photo
                </div>
              </div>
            )}
            {step === 6 && (
              <div className="flex flex-col items-start">
                <div className="flex flex-row">
                  <div className="2xl:text-3xl text-lg font-bold tracking-tight">
                    Where is your farm or garden located?
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button className="shadow-none bg-transparent hover:bg-transparent text-black">
                        <CiCircleInfo className="lg:text-4xl" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="popover xl:absolute xl:bottom-10">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            EZHomesteading uses data provided by you to generate
                            the default location. We do not track your location
                            unless you have given us permission.
                          </p>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="shadow-none bg-transparent hover:bg-transparent text-black m-0 p-0 text-xs">
                  Help local consumers find you!
                </div>
              </div>
            )}
            <Breadcrumb
              className={`${outfit.className} text-black pt-5 z-10 text-xs`}
            >
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="text-xs">
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem
                  className={
                    step === 1
                      ? "font-bold cursor-none text-xs"
                      : "font-normal cursor-pointer text-xs "
                  }
                  onMouseDown={() => setStep(1)}
                >
                  Description
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem
                  className={
                    step === 2
                      ? "font-bold cursor-none text-xs"
                      : "font-normal cursor-pointer"
                  }
                  onMouseDown={() => setStep(2)}
                >
                  Info
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem
                  className={
                    step === 3
                      ? "font-bold cursor-none "
                      : "font-normal cursor-pointer text-xs"
                  }
                  onMouseDown={() => setStep(3)}
                >
                  Rating
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem
                  className={
                    step === 4
                      ? "font-bold cursor-none "
                      : "font-normal cursor-pointer text-xs"
                  }
                  onMouseDown={() => setStep(4)}
                >
                  Hours
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem
                  className={
                    step === 5
                      ? "font-bold cursor-none "
                      : "font-normal cursor-pointer text-xs"
                  }
                  onMouseDown={() => setStep(5)}
                >
                  Photos
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem
                  className={
                    step === 6
                      ? "font-bold cursor-none "
                      : "font-normal cursor-pointer text-xs"
                  }
                  onMouseDown={() => {
                    if (!product) {
                      toast.error("Let us know what produce you have!", {
                        duration: 2000,
                        position: "bottom-right",
                      });
                      return;
                    } else if (!description) {
                      toast.error("Please write a brief description");
                      return;
                    } else if (!quantityType) {
                      toast.error("Please enter a unit for your listing");
                      return;
                    } else if (quantity <= 0 || !quantity) {
                      toast.error("Quantity must be greater than 0");
                      return;
                    } else if (minOrder <= 0 || !quantity) {
                      toast.error(
                        "Please enter a minimum order greater than 0."
                      );
                      return;
                    } else if (
                      Array.isArray(imageSrc) &&
                      imageSrc.length === 0
                    ) {
                      toast.error(
                        "Please use the stock photo or upload at least one photo"
                      );
                      return;
                    }

                    // if (step === STEPS.ORGANIC && !certificationChecked) {
                    //   toast.error("You must certify that the above information is accurate.");
                    //   return;
                    // }
                    else if (
                      shelfLifeDays <= 0 &&
                      shelfLifeWeeks <= 0 &&
                      shelfLifeMonths <= 0 &&
                      shelfLifeYears <= 0
                    ) {
                      toast.error("Shelf life must be at least 1 day");
                      return;
                    } else if (price <= 0 || !quantity) {
                      toast.error("Please enter a price greater than 0.");
                      return;
                    } else {
                      setStep(6);
                    }
                  }}
                >
                  Location
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        <div className="md:w-3/5 onboard-right relative">
          <div className="sm:min-h-screen mx-[5%] hideOverflow lg:py-20">
            {step === 1 && (
              <div className="flex flex-col gap-8">
                <div className="flex flex-row items-center justify-between w-full">
                  <Heading
                    title="List your produce!"
                    subtitle="Please provide a name and brief description"
                  />
                  <Dialog>
                    <DialogTrigger asChild>
                      <button>Suggest a new Listing</button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Propose a new Listing</DialogTitle>
                        <DialogDescription>
                          Please enter a title, category and brief keyword
                          description
                        </DialogDescription>
                      </DialogHeader>
                      <ul className="flex flex-col items-start justify-center">
                        <li className="flex flex-row items-center justify-center">
                          <Label className="w-[80px]">Title</Label>
                          <input placeholder="Special Tomato" />
                        </li>
                        <li className="flex flex-row items-center justify-center">
                          <Label className="w-[80px]">Category</Label>
                          <input placeholder="Vegetable" />
                        </li>
                        <li className="flex flex-row items-center justify-center">
                          <Label className="w-[80px]">Description</Label>
                          <input placeholder="Red Seedless" />
                        </li>
                      </ul>
                      <button type="submit" className="px-3">
                        <span>Submit</span>
                      </button>
                    </DialogContent>
                  </Dialog>
                </div>
                <div>
                  <SearchClient
                    value={product}
                    onChange={(value) => {
                      setProduct(value as ProductValue);
                      setValue("title", value?.label);
                      setValue("category", value?.category);
                      setValue("imageSrc[0]", value?.photo);
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
            )}
            {step === 6 && (
              <div className="sm:min-h-screen h-[calc(100vh-264px)] hideOverflow py-20">
                <div className="flex flex-col gap-8">
                  <Heading title="" />
                  <div className="flex flex-col lg:flex-row justify-evenly">
                    <div className="flex flex-row lg:flex-col justify-center">
                      <PiStorefrontThin
                        size="5em"
                        className={
                          clicked
                            ? "text-green-500 cursor-pointer"
                            : "cursor-pointer hover:text-green-500"
                        }
                        onClick={() => {
                          setValue("street", user?.location?.address[0]);
                          setValue("city", user?.location?.address[1]);
                          setValue("state", user?.location?.address[2]);
                          setValue("zip", user?.location?.address[3]);
                          setClicked(true);
                        }}
                      />
                      <ul>
                        <li className={`${outfit.className}`}>
                          Use My Default Location
                        </li>{" "}
                        {user?.location?.address.length === 4 ? (
                          <li className="text-xs">{`${user?.location?.address[0]}, ${user?.location?.address[1]}, ${user?.location?.address[2]}, ${user?.location?.address[3]}`}</li>
                        ) : (
                          <li>Full Address not available</li>
                        )}
                      </ul>
                    </div>
                    <div
                      className={`${outfit.className} flex flex-row lg:flex-col `}
                    >
                      <BiSearch
                        size="5em"
                        className={
                          c
                            ? "text-green-500 cursor-pointer"
                            : "cursor-pointer hover:text-green-500"
                        }
                        onClick={() => {
                          toggleLocationInput();
                          setClicked(false);
                          setC(true);
                        }}
                        style={{ cursor: "pointer" }}
                      />
                      Use a Different Location
                    </div>
                  </div>
                  <div className="flex flex-col gap-8">
                    <LocationSearchInput
                      address={watch("address")}
                      setAddress={(address) => setValue("address", address)}
                      onAddressParsed={handleAddressSelect}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-4">
                <Heading
                  title=""
                  subtitle="Is it not worth your time for someone to order less than a certain amount of this item? Set a minimum order requirement, or leave it at 1"
                />
                <div className="flex flex-row items-center gap-16 w-full">
                  <div className="w-1/2">
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
                  <div className="w-1/2">
                    <Input
                      id="minOrder"
                      label="Minimum order"
                      type="number"
                      disabled={isLoading}
                      register={register}
                      errors={errors}
                    />
                  </div>
                </div>
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
                  <div className="w-1/2">
                    <UnitSelect
                      value={quantityType}
                      onChange={(value) => {
                        setQuantityType(value as QuantityTypeValue);
                        setValue("quantityType", value?.value);
                      }}
                    />
                  </div>
                </div>
                <hr className="mb-3 w-5/8" />
                <div className="mb-3 flex justify-center text-center ">
                  <div className="mb-3 w-1/4">
                    <Label className="text-lg ">
                      Estimated Shelf Life
                      <div className="mb-3 text-sm">
                        <Counter
                          onChange={(value) =>
                            setCustomValue("shelfLifeDays", value)
                          }
                          value={shelfLifeDays}
                          title="Days"
                          subtitle=""
                        />
                      </div>
                      <div className="mb-3 text-sm">
                        <Counter
                          onChange={(value) =>
                            setCustomValue("shelfLifeWeeks", value)
                          }
                          value={shelfLifeWeeks}
                          title="Weeks"
                          subtitle=""
                        />
                      </div>
                      <div className="mb-3 text-sm">
                        <Counter
                          onChange={(value) =>
                            setCustomValue("shelfLifeMonths", value)
                          }
                          value={shelfLifeMonths}
                          title="Months"
                          subtitle=""
                        />
                      </div>
                      <div className="mb-3 text-sm">
                        <Counter
                          onChange={(value) =>
                            setCustomValue("shelfLifeYears", value)
                          }
                          value={shelfLifeYears}
                          title="Years"
                          subtitle=""
                        />
                      </div>
                    </Label>
                  </div>
                </div>
              </div>
            )}
            {step === 5 && (
              <div
                className={`${outfit.className} flex flex-col gap-8 sm:justify-between items-stretch`}
              >
                <Heading title="" />
                <div className="flex flex-col sm:flex-row gap-x-2 gap-y-2 items-center justify-center">
                  {[...Array(3)].map((_, index) => (
                    <div
                      key={index}
                      className={`relative h-40 sm:h-60 w-48 transition-transform duration-300 rounded-xl ${
                        imageStates[index].isHovered
                          ? "transform shadow-xl"
                          : ""
                      } ${imageStates[index].isFocused ? "z-10" : "z-0"}`}
                      onMouseEnter={() => handleMouseEnter(index)}
                      onMouseLeave={() => handleMouseLeave(index)}
                      onClick={() => handleClick(index)}
                    >
                      {watch(`imageSrc[${index}]`) ? (
                        <>
                          <Image
                            src={watch(`imageSrc[${index}]`)}
                            fill
                            alt={`Listing Image ${index + 1}`}
                            className="object-cover rounded-xl"
                          />
                          <button
                            className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md"
                            onClick={(e) => {
                              e.stopPropagation();
                              const newImageSrc = [...watch("imageSrc")];
                              newImageSrc.splice(index, 1);
                              setValue("imageSrc", newImageSrc);
                            }}
                          >
                            <BsBucket />
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center justify-center rounded-xl border-dashed border-2 border-black h-full">
                          {" "}
                          <UploadButton
                            endpoint="imageUploader"
                            onClientUploadComplete={(res: any) => {
                              const newImageSrc = [...watch("imageSrc")];
                              const emptyIndex = newImageSrc.findIndex(
                                (src) => !src
                              );
                              if (emptyIndex !== -1) {
                                newImageSrc[emptyIndex] = res[0].url;
                              } else {
                                newImageSrc.push(res[0].url);
                              }
                              setValue("imageSrc", newImageSrc);
                            }}
                            onUploadError={(error: Error) => {
                              alert(`ERROR! ${error.message}`);
                            }}
                            appearance={{
                              container: "h-full w-max",
                            }}
                            className="ut-allowed-content:hidden ut-button:bg-white ut-button:text-black ut-button:w-fit ut-button:px-2 ut-button:h-full"
                            content={{
                              button({ ready }) {
                                if (ready) return <div>Upload Image</div>;
                                return "Getting ready...";
                              },
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="flex flex-col gap-8">
                <Heading title="" />
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
                    <Label>
                      This produce was not grown with inorganic fertilizers
                    </Label>
                  </div>
                  <div className="flex flex-row gap-x-2 items-center">
                    <Checkbox
                    // onChange={(e) => handleCheckboxChange(e)}
                    />
                    <Label>
                      This produce was not grown with inorganic pestacides
                    </Label>
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
            )}
            {step === 4 && <div> INSERT HOURS COMPONENT HERE</div>}
            {step > 1 && (
              <IoReturnDownBack
                onClick={handlePrevious}
                className="absolute bottom-0 left-5 text-6xl hover:cursor-pointer"
              />
            )}

            {step < 7 && (
              <IoReturnDownForward
                onClick={handleNext}
                className="absolute bottom-0 right-5 text-6xl hover:cursor-pointer"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateClient;
