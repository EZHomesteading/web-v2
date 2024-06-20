"use client";
//update listing page
import axios from "axios";
import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Label } from "@/app/components/ui/label";
import Input from "@/app/components/inputs/Input";
import Heading from "@/app/components/Heading";
import { Button } from "@/app/components/ui/button";
import { SafeListing } from "@/types";
import { useRouter } from "next/navigation";
import { UploadButton } from "@/utils/uploadthing";
import Image from "next/image";
import { BsBucket } from "react-icons/bs";
import { Card, CardContent, CardFooter } from "@/app/components/ui/card";
import { Textarea } from "@/app/components/ui/textarea";
import { Outfit } from "next/font/google";

import { createEmails } from "@/hooks/user/email-Users";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import UnitSelect, {
  QuantityTypeValue,
} from "@/app/create/components/UnitSelect";
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
  const [checkbox1Checked, setCheckbox1Checked] = useState(false);
  const [checkbox2Checked, setCheckbox2Checked] = useState(false);
  const [checkbox3Checked, setCheckbox3Checked] = useState(false);
  const [checkbox4Checked, setCheckbox4Checked] = useState(false);
  const [coopRating, setCoopRating] = useState(1);

  const router = useRouter();
  const handleCheckboxChange = (checked: boolean, index: number) => {
    let newRating = checked ? coopRating + 1 : coopRating - 1;
    newRating = Math.max(1, Math.min(newRating, 5));
    setCoopRating(newRating);

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
    const formData = {
      ...data,
      minOrder: parseInt(data.minOrder),
      SODT: parseInt(data.sodt),
      stock: parseInt(data.stock),
      shelfLife: parseInt(data.shelfLife),
      price: parseFloat(data.price),
      imageSrc: watch("imageSrc"),
      description: description,
      quantityType:
        data.quantityType === "none" || data.quantityType === "each"
          ? ""
          : data.quantityType,
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
        router.replace("/dashboard/my-store");
      });
  };

  return (
    <>
      <div className="flex flex-col gap-y-8 px-2 lg:px-40 mb-8">
        <div className="flex justify-between md:pt-12 items-center">
          <Heading
            title="Update Your Listing"
            subtitle={`Modify the details for your ${listing?.title} here`}
          />
          <Button onClick={handleSubmit(onSubmit)} className="bg-green-500">
            Update
          </Button>
        </div>

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
                onValueChange={(value: any) => {
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
                htmlFor="email"
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
        <Button onClick={handleSubmit(onSubmit)} className="bg-green-500 w-fit">
          Update
        </Button>
      </div>
    </>
  );
};

export default UpdateClient;
