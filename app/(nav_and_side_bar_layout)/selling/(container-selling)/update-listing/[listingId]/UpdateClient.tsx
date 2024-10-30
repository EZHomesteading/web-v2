"use client";
//update listing page
import axios from "axios";
import { useCallback, useState, useEffect } from "react";
import { toast } from "sonner";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Input from "@/components/inputs/Input";
import Heading from "@/components/Heading";
import { Button } from "@/components/ui/button";
import HarvestDatesSelector from "./HarvestDatesSelector";

import { SafeListing } from "@/types";
import { useRouter } from "next/navigation";
import { UploadButton } from "@/utils/uploadthing";
import Image from "next/image";
import { BsBucket } from "react-icons/bs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Outfit } from "next/font/google";

import { createEmails } from "@/hooks/user/email-Users";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UnitSelect, {
  QuantityTypeValue,
} from "@/app/(no-nav_layout)/create/components/UnitSelect";
import { HoverButton } from "@/components/ui/hoverButton";
import { outfitFont } from "@/components/fonts";
type Month =
  | "Jan"
  | "Feb"
  | "Mar"
  | "Apr"
  | "May"
  | "Jun"
  | "Jul"
  | "Aug"
  | "Sep"
  | "Oct"
  | "Nov"
  | "Dec";
const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

interface UpdateListingProps {
  listing: SafeListing;
}

const UpdateClient = ({ listing }: UpdateListingProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [quantityType, setQuantityType] = useState<QuantityTypeValue>();
  const [certificationChecked, setCertificationChecked] = useState(false);
  const [harvestDates, setHarvestDates] = useState<Month[]>(
    (listing.harvestDates as Month[]) || []
  );

  const [checkbox1Checked, setCheckbox1Checked] = useState(false);
  const [checkbox2Checked, setCheckbox2Checked] = useState(false);
  const [checkbox3Checked, setCheckbox3Checked] = useState(false);
  const [checkbox4Checked, setCheckbox4Checked] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [clicked1, setClicked1] = useState(false);
  const [clicked2, setClicked2] = useState(false);
  const [rating, setRating] = useState<number[]>(listing?.rating);
  const [coopRating, setCoopRating] = useState(1);
  const router = useRouter();
  useEffect(() => {
    if (listing.rating.includes(1)) {
      setCheckbox1Checked(true);
      console.log(listing.rating);
    }
    if (listing.rating.includes(2)) {
      setCheckbox2Checked(true);
      console.log(listing.rating);
    }
    if (listing.rating.includes(3)) {
      setCheckbox3Checked(true);
      console.log(listing.rating);
    }
    if (listing.rating.includes(4)) {
      setCheckbox4Checked(true);
      console.log(listing.rating);
    }
  }, []);
  useEffect(() => {
    if (listing.location.id != "") {
      listing.user.locations?.map((location, index) => {
        if (location.id === listing.location.id) {
          console.log("Found default location at index:", index);

          switch (index) {
            case 0:
              setClicked(true);
              setClicked1(false);
              setClicked2(false);

              break;
            case 1:
              setClicked(false);
              setClicked1(true);
              setClicked2(false);

              break;
            case 2:
              setClicked(false);
              setClicked1(false);
              setClicked2(true);

              break;
            default:
              break;
          }
        }
      });
    }
  }, []);
  const handleCheckboxChange = (checked: boolean, index: number) => {
    setRating((prevRating) => {
      let newRating = [...prevRating];
      if (checked) {
        if (!newRating.includes(index + 1)) {
          newRating.push(index + 1);
        }
      } else {
        newRating = newRating.filter((value) => value !== index + 1);
      }
      console.log(newRating.sort((a, b) => a - b));
      return newRating.sort((a, b) => a - b);
    });

    switch (index) {
      case 0:
        setCheckbox1Checked(checked);
        break;
      case 1:
        setCheckbox2Checked(checked);
        break;
      case 2:
        setCheckbox3Checked(checked);
        break;
      case 3:
        setCheckbox4Checked(checked);
        break;
      default:
        break;
    }
  };
  const handleCertificationCheckboxChange = (checked: boolean) => {
    setCertificationChecked(checked);
    setRating((prevRating) => {
      if (checked) {
        if (!prevRating.includes(0)) {
          return [0, ...prevRating];
        }
      } else {
        console.log(prevRating.filter((value) => value !== 0));
        return prevRating.filter((value) => value !== 0);
      }
      console.log(prevRating);
      return prevRating;
    });
  };
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      id: listing?.id,
      description: listing?.description,
      title: listing?.title,
      stock: listing?.stock,
      price: listing?.price,
      shelfLife: listing?.shelfLife,
      imageSrc: listing?.imageSrc ?? [],
      category: listing?.category,
      quantityType: listing?.quantityType,
      emailList: listing?.emailList,
      minOrder: listing?.minOrder,
      sodt: listing?.SODT,
      location: listing?.location.id,
      harvestFeatures: listing?.harvestFeatures,
      harvestDates: listing.harvestDates,
      projectedStock: listing.projectedStock,
    },
  });
  const [description, setDescription] = useState(listing.description);
  const sodt = watch("sodt");
  const minOrder = watch("minOrder");
  const [imageStates, setImageStates] = useState(
    [...Array(3)].map(() => ({
      isHovered: false,
      isFocused: false,
    }))
  );
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

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    if (listing.stock === 0) {
      if (!listing.emailList) {
      } else {
        await createEmails(listing.emailList.list, listing);

        data.emailList.list = null;
        data.emailList = null;
      }
    }
    if (rating !== listing.rating && certificationChecked === false) {
      toast.success("You must verify your organic rating");
      return;
    }
    const formData = {
      ...data,
      rating: rating,
      minOrder: parseInt(data.minOrder),
      SODT: parseInt(data.sodt),
      stock: parseInt(data.stock),
      shelfLife: parseInt(data.shelfLife),
      price: parseFloat(data.price),
      imageSrc: watch("imageSrc"),
      description: description,
      location: data.location,
      harvestFeatures: data.harvestFeatures,
      harvestDates: harvestDates,
      projectedStock: data.projectedStock,
      quantityType:
        data.quantityType === "none" || data.quantityType === "each"
          ? ""
          : data.quantityType,
    };
    axios
      .post("/api/listing/updateListing", formData)
      .then(() => {
        toast.success("Your Listing was Updated!");
      })
      .catch((error) => {
        toast.error(error);
      })
      .finally(() => {
        setIsLoading(false);
        router.replace("/selling/my-store");
      });
  };
  const handleConvert = () => {
    if (listing.harvestFeatures) {
      axios
        .post("/api/listing/updateListing", {
          id: listing.id,
          harvestDates: [],
          harvestFeatures: false,
          projectedStock: null,
          stock: listing.projectedStock,
        })
        .then(() => {
          toast.success("Your Listing was Updated!");
        })
        .catch((error) => {
          toast.error(error);
        })
        .finally(() => {
          setIsLoading(false);
          router.refresh();
        });
    } else {
      axios
        .post("/api/listing/updateListing", {
          id: listing.id,
          harvestDates: [],
          harvestFeatures: true,
          projectedStock: listing.stock,
          stock: 0,
        })
        .then(() => {
          toast.success("Your Listing was Updated!");
        })
        .catch((error) => {
          toast.error(error);
        })
        .finally(() => {
          setIsLoading(false);
          router.refresh();
        });
    }
  };

  return (
    <>
      <div className="flex flex-col gap-y-8 px-2 lg:px-40 mb-8">
        <div className="flex justify-between md:pt-12 items-center">
          <Heading
            title="Update Your Listing"
            subtitle={`Modify the details for your ${listing?.title} here`}
          />
          {listing.harvestFeatures ? (
            <div onClick={() => handleConvert()}>
              <HoverButton
                buttonText={" Convert to Active Listing"}
                hoverMessage={
                  "Convert this listing to an active listing with stock equal to your expected quantity per day"
                }
              ></HoverButton>
            </div>
          ) : (
            <div onClick={() => handleConvert()}>
              <HoverButton
                buttonText={" Convert to Projected Listing"}
                hoverMessage={
                  "Convert this listing to a projected listing with an expected quantity per day equal to your current stock "
                }
              ></HoverButton>
            </div>
          )}
          <Button onClick={handleSubmit(onSubmit)} className="bg-green-500">
            Update
          </Button>
        </div>

        {listing.harvestFeatures ? (
          <Card>
            <CardContent className="flex flex-col sheet  border-none shadow-lg w-full">
              <h1 className="text-lg lg:text-3xl">Expected Quantity Per day</h1>
              <ul>
                <li>
                  Quantity you expect to have for sale each day during the
                  harvest season, given the units you've specified.
                </li>
              </ul>
              <div className="flex justify-end">
                <Input
                  id="projectedStock"
                  label="Expected Quantity Per Day"
                  disabled={isLoading}
                  register={register}
                  errors={errors}
                />
              </div>

              <CardFooter className="flex justify-between m-0 p-0 pt-2">
                Listings with no stock will not be listed on the market but are
                visible on your store.
              </CardFooter>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex flex-col sheet  border-none shadow-lg w-full">
              <h1 className="text-lg lg:text-3xl">Stock</h1>
              <ul>
                <li>
                  Quantity available for sale given the units you've specified.
                </li>
              </ul>
              <div className="flex justify-end">
                <Input
                  id="stock"
                  label="Stock"
                  disabled={isLoading}
                  register={register}
                  errors={errors}
                />
              </div>

              <CardFooter className="flex justify-between m-0 p-0 pt-2">
                Listings with no stock will not be listed on the market but are
                visible on your store.
              </CardFooter>
            </CardContent>
          </Card>
        )}
        {listing.harvestFeatures && (
          <Card>
            <CardContent className="flex flex-col sheet border-none shadow-lg w-full">
              <HarvestDatesSelector
                initialDates={(listing.harvestDates as Month[]) || []}
                onChange={(newDates: Month[]) => {
                  setHarvestDates(newDates);
                  setValue("harvestDates", newDates);
                }}
              />
            </CardContent>
          </Card>
        )}
        <Card>
          <CardContent className="flex flex-col sheet  border-none shadow-lg w-full">
            <h2 className="lg:text-3xl text-lg">Shelf Life</h2>
            <ul>
              <li>Estimated time in days before your produce goes bad</li>
              <li>
                This number does not have to be exact, and you can update the
                shelf life as the produce does or doesnt begin to spoil.
              </li>
            </ul>
            <div className="flex justify-end">
              <Input
                id="shelfLife"
                label="Shelf Life"
                disabled={isLoading}
                register={register}
                errors={errors}
              />
            </div>

            <CardFooter className="flex justify-between m-0 p-0 pt-2">
              A Shelf Life is required.
            </CardFooter>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col sheet  border-none shadow-lg w-full">
            <h2 className="lg:text-3xl text-lg">Units</h2>
            <ul>
              <li>How your product is measured to be sold</li>
            </ul>
            <div className="flex justify-end">
              <UnitSelect
                value={quantityType}
                onChange={(value) => {
                  setQuantityType(value as QuantityTypeValue);
                  setValue("quantityType", value?.value);
                }}
              />
            </div>

            <CardFooter className="flex justify-between m-0 p-0 pt-2">
              A Unit is required.
            </CardFooter>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col sheet  border-none shadow-lg w-full">
            <h2 className="lg:text-3xl text-lg">Minimum Order</h2>
            <ul>
              <li>
                Set the Minimum amount of your product someone needs to select
                to place an order
              </li>
            </ul>
            <div className="flex justify-end">
              <Input
                id="minOrder"
                label="Minimum order"
                type="number"
                disabled={isLoading}
                register={register}
                errors={errors}
              />
            </div>

            <CardFooter className="flex justify-between m-0 p-0 pt-2">
              A minimum order is required, minimum 1.
            </CardFooter>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col sheet  border-none shadow-lg w-full">
            <h2 className="lg:text-3xl text-lg">Organic Rating</h2>
            <ul>
              <li>Edit Your organic rating</li>
            </ul>
            <div className="flex justify-end">
              <div className="flex flex-col gap-y-2">
                <div className="flex flex-row gap-x-2 items-center">
                  <Checkbox
                    checked={checkbox1Checked}
                    onCheckedChange={(checked: boolean) =>
                      handleCheckboxChange(checked, 0)
                    }
                  />
                  <Label>This produce is not genetically modified</Label>
                </div>
                <div className="flex flex-row gap-x-2 items-center">
                  <Checkbox
                    checked={checkbox2Checked}
                    onCheckedChange={(checked: boolean) =>
                      handleCheckboxChange(checked, 1)
                    }
                  />
                  <Label>
                    This produce was not grown with inorganic fertilizers
                  </Label>
                </div>
                <div className="flex flex-row gap-x-2 items-center">
                  <Checkbox
                    checked={checkbox3Checked}
                    onCheckedChange={(checked: boolean) =>
                      handleCheckboxChange(checked, 2)
                    }
                  />
                  <Label>
                    This produce was not grown with inorganic pestacides
                  </Label>
                </div>
                <div className="flex flex-row gap-x-2 items-center">
                  <Checkbox
                    checked={checkbox4Checked}
                    onCheckedChange={(checked: boolean) =>
                      handleCheckboxChange(checked, 3)
                    }
                  />
                  <Label>This produce was not modified after harvest</Label>
                </div>
                <div className="flex flex-row gap-x-2 font-extrabold items-center">
                  <Checkbox
                    checked={certificationChecked}
                    onCheckedChange={(checked: boolean) =>
                      handleCertificationCheckboxChange(checked)
                    }
                  />
                  <Label className="font-bold">
                    I certify that all of the above information is accurate
                  </Label>
                </div>
              </div>
            </div>

            <CardFooter className="flex justify-between m-0 p-0 pt-2">
              A Organic rating is not required.
            </CardFooter>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col sheet  border-none shadow-lg w-full">
            <h2 className="lg:text-3xl text-lg">Set Out Time</h2>
            <ul>
              <li>Estimated time time to have this product ready</li>
            </ul>
            <div className="flex justify-end">
              <Select
                onValueChange={(value: string) => {
                  setValue("sodt", value);
                }}
              >
                <SelectTrigger className="w-fit h-1/6 bg-slate-300 text-black text-xl">
                  {listing.SODT ? (
                    <SelectValue placeholder={`${listing.SODT} Minutes `} />
                  ) : (
                    <SelectValue placeholder={"Select a Time"} />
                  )}
                </SelectTrigger>
                <SelectContent className={`${outfit.className} bg-slate-300`}>
                  <SelectGroup>
                    <SelectItem value="15">15 Minutes</SelectItem>
                    <SelectItem value="30">30 Minutes</SelectItem>
                    <SelectItem value="45">45 Minutes</SelectItem>
                    <SelectItem value="60">1 Hour</SelectItem>
                    <SelectItem value="75">1 Hour 15 Minutes</SelectItem>
                    <SelectItem value="90">1 Hour 30 Minutes</SelectItem>
                    <SelectItem value="105">1 Hour 45 Minutes</SelectItem>
                    <SelectItem value="120">2 Hours</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <CardFooter className="flex justify-between m-0 p-0 pt-2">
              A Set out time is required.
            </CardFooter>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col sheet  border-none shadow-lg w-full">
            <h3 className="text-lg lg:text-3xl">Produce Images</h3>

            <div className="justify-end flex">
              <label
                htmlFor="images"
                className="block text-sm font-medium leading-6"
              ></label>{" "}
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className={`relative h-40 sm:h-60 w-48 transition-transform duration-300 rounded-xl ml-2 ${
                    imageStates[index].isHovered ? "transform shadow-xl" : ""
                  } ${imageStates[index].isFocused ? "z-10" : "z-0"}`}
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
                        onClientUploadComplete={(res: { url: string }[]) => {
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
                        className="ut-allowed-content:hidden ut-button:bg-inherit ut-button:text-black ut-button:w-fit ut-button:px-2 ut-button:h-full"
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

            <CardFooter className="flex justify-between m-0 p-0 pt-2">
              Atleast one image is required.
            </CardFooter>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col sheet  border-none shadow-lg w-full">
            <h4 className="text-lg lg:text-3xl">Price</h4>
            <ul>
              <li>
                The amount you would like to charge per unit you've specified,
                not the total price.
              </li>
              <li>Buyers cannot negotiate price on EZHomesteading</li>
            </ul>
            <div className="flex justify-end">
              <label
                htmlFor="price"
                className="block text-sm font-medium leading-6"
              ></label>
              <Input
                id="price"
                label="Price"
                disabled={isLoading}
                register={register}
                errors={errors}
              />
            </div>
            <CardFooter className="flex justify-between m-0 p-0 pt-2">
              Price must be atleast $0.01
            </CardFooter>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col sheet  border-none shadow-lg w-full">
            <h5 className="text-lg lg:text-2xl">Description</h5>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium leading-6"
              ></label>

              <div className="flex justify-end">
                {" "}
                <Textarea
                  id="price"
                  disabled={isLoading}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col sheet  border-none shadow-lg w-full">
            <h4 className="text-lg lg:text-3xl">Change Location</h4>
            <p>
              Your listing location is approximate on the site and only revealed
              to indivdual buyers once they've made a purchase
            </p>
            <div className="flex justify-start w-full">
              <label
                htmlFor="Location"
                className="block text-sm font-medium leading-6"
              ></label>
              <div
                className={`h-[calc(100vh-138.39px)] md:h-full w-full md:py-5 fade-in`}
              >
                <div className="flex flex-col w-full">
                  {listing.user.locations === null ||
                  listing.user.locations === undefined ||
                  ((listing.user.locations[0] === null ||
                    listing.user.locations[0] === undefined) &&
                    (listing.user.locations[1] === null ||
                      listing.user.locations[1] === undefined) &&
                    (listing.user.locations[2] === null ||
                      listing.user.locations[2] === undefined)) ? (
                    <Card
                      className={""}
                      onClick={() => {
                        router.replace("/onboard");
                      }}
                    >
                      <CardContent>
                        <CardHeader className="pt-2 sm:pt-6">
                          <div className="text-start">
                            <div className="text-xl sm:text-2xl font-bold">
                              You have no addresses set. Please set this up
                              before creating a listing. Click Here to set up
                              Store Locations
                            </div>
                          </div>
                        </CardHeader>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="flex justify-end w-full ">
                      <div className="flex flex-row justify-evenly gap-2 pt-4 w-full max-w-2xl">
                        {listing.user.locations.length >= 1 && (
                          <Card
                            className={
                              clicked
                                ? "bg-black text-white shadow-sm"
                                : "shadow-sm hover:cursor-pointer"
                            }
                            onClick={() => {
                              if (listing.user.locations) {
                                setClicked(true);
                                setClicked1(false);
                                setClicked2(false);
                                setValue(
                                  "locationId",
                                  listing.user.locations[0].id
                                );
                              }
                            }}
                          >
                            <CardContent className="pt-2 sm:pt-6 flex flex-col items-start justify-center">
                              <div className="text-start">
                                <div className="text-xl font-normal">
                                  Use My Default Address
                                </div>
                              </div>
                              <div className="font-light text-neutral-500 mt-2 md:text-xs text-[.7rem]">
                                <ul>
                                  <li
                                    className={`${outfitFont.className}`}
                                  ></li>{" "}
                                  {listing.user.locations &&
                                  listing.user.locations[0]?.address.length ===
                                    4 ? (
                                    <li className="text-xs">{`${listing.user.locations[0]?.address[0]}, ${listing.user.locations[0]?.address[1]}, ${listing.user.locations[0]?.address[2]}, ${listing.user.locations[0]?.address[3]}`}</li>
                                  ) : (
                                    <li>Full Address not available</li>
                                  )}
                                </ul>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                        {listing.user.locations.length >= 2 && (
                          <Card
                            className={
                              clicked1
                                ? "bg-black text-white shadow-sm"
                                : "shadow-sm hover:cursor-pointer"
                            }
                            onClick={() => {
                              if (listing.user.locations) {
                                setClicked1(true);
                                setClicked(false);
                                setClicked2(false);
                                setValue(
                                  "locationId",
                                  listing.user.locations[1].id
                                );
                              }
                            }}
                          >
                            <CardContent className="pt-2 sm:pt-6 flex flex-col items-start justify-center">
                              <div className="text-start">
                                <div className="text-xl ">
                                  Use My Second Location
                                </div>
                                <div className="font-light text-neutral-500 mt-2 md:text-xs text-[.7rem]">
                                  <ul>
                                    <li
                                      className={`${outfitFont.className}`}
                                    ></li>{" "}
                                    {listing.user.locations &&
                                    listing.user.locations[1]?.address
                                      .length === 4 ? (
                                      <li className="text-xs">{`${listing.user.locations[1]?.address[0]}, ${listing.user.locations[1]?.address[1]}, ${listing.user.locations[1]?.address[2]}, ${listing.user.locations[1]?.address[3]}`}</li>
                                    ) : (
                                      <li>Full Address not available</li>
                                    )}
                                  </ul>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                        {listing.user.locations.length === 3 && (
                          <Card
                            className={
                              clicked2
                                ? "bg-black text-white shadow-sm"
                                : "shadow-sm hover:cursor-pointer"
                            }
                            onClick={() => {
                              if (listing.user.locations) {
                                setClicked2(true);
                                setClicked1(false);
                                setClicked(false);
                                setValue(
                                  "locationId",
                                  listing.user.locations[2].id
                                );
                              }
                            }}
                          >
                            <CardContent className="pt-2 sm:pt-6 flex flex-col items-start justify-center">
                              <div className="text-start">
                                <div className="text-xl ">
                                  Use My Third Location
                                </div>
                                <div className="font-light text-neutral-500 mt-2 md:text-xs text-[.7rem]">
                                  <ul>
                                    <li
                                      className={`${outfitFont.className}`}
                                    ></li>{" "}
                                    {listing.user.locations &&
                                    listing.user.locations[2]?.address
                                      .length === 4 ? (
                                      <li className="text-xs">{`${listing.user.locations[2]?.address[0]}, ${listing.user.locations[2]?.address[1]}, ${listing.user.locations[2]?.address[2]}, ${listing.user.locations[2]?.address[3]}`}</li>
                                    ) : (
                                      <li>Full Address not available</li>
                                    )}
                                  </ul>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                        {listing.user.locations.length < 3 && (
                          <Card
                            className={
                              clicked2
                                ? "bg-black text-white shadow-sm"
                                : "shadow-sm hover:cursor-pointer"
                            }
                            onClick={() => {
                              router.push("/onboard");
                            }}
                          >
                            <CardContent className="pt-2 sm:pt-6 flex flex-col items-start justify-center">
                              <div className="text-start">
                                <div className="text-xl ">
                                  Create a{" "}
                                  {listing.user.locations.length === 1
                                    ? "Second Location?"
                                    : listing.user.locations.length === 2
                                    ? "Third Location?"
                                    : "Location"}{" "}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Button onClick={handleSubmit(onSubmit)} className="bg-green-500 w-fit">
          Update
        </Button>
      </div>
    </>
  );
};

export default UpdateClient;
