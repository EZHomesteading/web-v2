"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/user/use-current-user";
import LocationSearchInput from "@/app/components/map/LocationSearchInputSettings";
import AccountCard from "./account-card";
import Input from "./input";
import { Button } from "@/app/components/ui/button";
import { UploadButton } from "@/utils/uploadthing";
import { FormValues, AddressFields } from "./types";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTrigger,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/app/components/ui/alert-dialog";

interface PageProps {
  apiKey: string;
}

const Page: React.FC<PageProps> = ({ apiKey }) => {
  const user = useCurrentUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [image, setImage] = useState<string | undefined>(user?.image);
  const [address, setAddress] = useState("");
  const [addressFields, setAddressFields] = useState<AddressFields>({
    street: user?.location?.[0]?.address?.[0] || "",
    city: user?.location?.[0]?.address?.[1] || "",
    state: user?.location?.[0]?.address?.[2] || "",
    zip: user?.location?.[0]?.address?.[3] || "",
    apt: user?.location?.[0]?.address?.[4] || "",
  });

  const truncateAddress = (address: string, maxLength: number = 60) => {
    if (address.length <= maxLength) return address;
    return `${address.substring(0, maxLength)}...`;
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      name: user?.name,
      email: user?.email,
      phoneNumber: user?.phoneNumber,
      ...addressFields,
    },
  });

  const watchedFields = watch();

  useEffect(() => {
    reset({
      name: user?.name,
      email: user?.email,
      phoneNumber: user?.phoneNumber,
      ...addressFields,
    });
  }, [user, addressFields, reset]);

  const handleAddressSelect = useCallback(
    ({
      street,
      city,
      state,
      zip,
      fullAddress,
    }: AddressFields & { fullAddress: string }) => {
      setAddressFields({ street, apt: "", city, state, zip });
      setValue("street", street, { shouldValidate: true, shouldDirty: true });
      setValue("city", city, { shouldValidate: true, shouldDirty: true });
      setValue("state", state, { shouldValidate: true, shouldDirty: true });
      setValue("zip", zip, { shouldValidate: true, shouldDirty: true });
      setAddress(fullAddress);
    },
    [setValue]
  );

  const getLatLngFromAddress = async (address: string) => {
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

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    const fullAddress = `${data.street}, ${data.city}, ${data.state}, ${data.zip}`;

    let geoData = null;
    if (fullAddress.trim() !== ", , , ") {
      console.log("Calling getLatLngFromAddress with:", fullAddress);
      geoData = await getLatLngFromAddress(fullAddress);
      console.log("Geo data received:", geoData);
    }

    const formData = {
      image,
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      location: geoData
        ? {
            0: {
              type: "Point",
              coordinates: [geoData.lng, geoData.lat],
              address: [data.street, data.city, data.state, data.zip],
              hours: user?.location?.[0]?.hours || null,
            },
          }
        : user?.location,
    };

    try {
      await axios.post("/api/useractions/update", formData);
      setEditingCard(null);
    } catch (error) {
      toast.error("Failed to update account details");
      console.error("Update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditStart = (cardName: string) => {
    setEditingCard(cardName);
    if (cardName === "Address") {
      setAddress("");
      setAddressFields({ street: "", apt: "", city: "", state: "", zip: "" });
      setValue("street", "");
      setValue("apt", "");
      setValue("city", "");
      setValue("state", "");
      setValue("zip", "");
    }
  };

  const handleEditCancel = () => {
    setEditingCard(null);
    reset();
    if (editingCard === "Address") {
      setAddress(user?.location?.[0]?.address?.join(", ") || "");
      setAddressFields({
        street: user?.location?.[0]?.address?.[0] || "",
        apt: "",
        city: user?.location?.[0]?.address?.[1] || "",
        state: user?.location?.[0]?.address?.[2] || "",
        zip: user?.location?.[0]?.address?.[3] || "",
      });
    }
  };
  const onDelete = () => {
    axios
      .delete(`/api/auth/register/${user?.id}`)
      .then(() => {
        toast.success("Your account has been deleted");
      })
      .catch((error) => {
        toast.error(error?.response?.data?.error);
      })
      .finally(() => {
        location.replace("/");
      });
  };
  return (
    <>
      <div className="flex flex-col ">
        <h2 className="text-2xl font-medium pb-0">Personal Info</h2>

        <AccountCard
          title="Username"
          info={watchedFields.name || "No Username Saved"}
          onSave={handleSubmit(onSubmit)}
          isEditing={editingCard === "Username"}
          onEditStart={() => handleEditStart("Username")}
          onEditCancel={handleEditCancel}
          isDisabled={editingCard !== null && editingCard !== "Username"}
        >
          <Input
            id="name"
            label="Username"
            disabled={isLoading}
            register={register}
            errors={errors}
            isUsername={true}
            required
          />
        </AccountCard>

        <AccountCard
          title="Email"
          info={watchedFields.email || "No Email Saved"}
          onSave={handleSubmit(onSubmit)}
          isEditing={editingCard === "Email"}
          onEditStart={() => handleEditStart("Email")}
          onEditCancel={handleEditCancel}
          isDisabled={editingCard !== null && editingCard !== "Email"}
        >
          <Input
            id="email"
            label="Email"
            disabled={isLoading}
            register={register}
            errors={errors}
            isEmail={true}
            required
          />
        </AccountCard>
        <AccountCard
          title="Phone Number"
          info={watchedFields.phoneNumber || "No Phone Number Saved"}
          onSave={handleSubmit(onSubmit)}
          isEditing={editingCard === "PhoneNumber"}
          onEditStart={() => handleEditStart("PhoneNumber")}
          onEditCancel={handleEditCancel}
          isDisabled={editingCard !== null && editingCard !== "PhoneNumber"}
        >
          <Input
            isPhoneNumber={true}
            id="phoneNumber"
            label="Phone Number"
            register={register}
            errors={errors}
            disabled={isLoading}
          />
        </AccountCard>
        <AccountCard
          title="Address"
          info={
            truncateAddress(
              `${watchedFields.street}${
                watchedFields.apt ? ", " + watchedFields.apt : ""
              }, ${watchedFields.city}, ${watchedFields.state}, ${
                watchedFields.zip
              }`
            ) || "No Address Saved"
          }
          onSave={handleSubmit(onSubmit)}
          isEditing={editingCard === "Address"}
          onEditStart={() => handleEditStart("Address")}
          onEditCancel={handleEditCancel}
          isDisabled={editingCard !== null && editingCard !== "Address"}
        >
          <>
            <LocationSearchInput
              apiKey={apiKey}
              address={address}
              setAddress={setAddress}
              onAddressParsed={handleAddressSelect}
            />
            <div className="grid grid-rows-4 sm:grid-rows-2 sm:grid-cols-2 gap-4 mt-4">
              <Input
                id="apt"
                label="Apt. No, Suite (optional)"
                disabled={isLoading}
                register={register}
                errors={errors}
              />
              <Input
                id="city"
                label="City"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
              />
              <Input
                id="state"
                label="State"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
              />
              <Input
                id="zip"
                label="ZIP Code"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
              />
            </div>
          </>
        </AccountCard>
        <AccountCard
          title="Profile Image"
          info={image}
          showAvatar={true}
          onSave={() => {}}
          isEditing={editingCard === "Image"}
          onEditStart={() => setEditingCard("Image")}
          onEditCancel={() => setEditingCard(null)}
          isDisabled={editingCard !== null && editingCard !== "Image"}
        >
          {" "}
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res: { url: string }[]) => {
              setImage(res[0].url);
            }}
            onUploadError={(error: Error) => {
              alert(`ERROR! ${error.message}`);
            }}
            className="ut-allowed-content:hidden ut-button:inline-flex ut-button:items-center ut-button:justify-center ut-button:whitespace-nowrap ut-button:rounded-md ut-button:text-sm ut-button:font-medium ut-button:transition-colors ut-button:focus-visible:outline-none ut-button:focus-visible:ring-1 ut-button:focus-visible:ring-ring ut-button:disabled:pointer-events-none ut-button:disabled:opacity-50 ut-button:h-9 ut-button:px-4 ut-button:py-2 ut-button:border ut-button:border-input  ut-button:hover:bg-accent ut-button:hover:text-accent-foreground ut-button:text-black ut-button:mr-2 ut-button:bg-inherit"
            content={{
              button({ ready }) {
                if (ready) return <div>Upload Profile Image</div>;
                return "Getting ready...";
              },
            }}
          />
        </AccountCard>
        <AccountCard
          title="Password"
          info="**********"
          onSave={() => {}}
          isEditing={editingCard === "Password"}
          onEditStart={() => setEditingCard("Password")}
          onEditCancel={() => setEditingCard(null)}
          isDisabled={editingCard !== null && editingCard !== "Password"}
          showSave={false}
        >
          <div className="space-y-2">
            <Input
              id="oldPass"
              type="password"
              label="Current Password"
              disabled={isLoading}
              register={register}
              errors={errors}
            />
            <Input
              id="newPass"
              type="password"
              label="New Password"
              disabled={isLoading}
              register={register}
              errors={errors}
            />
            <Input
              id="verifPass"
              type="password"
              label="Verify Password"
              disabled={isLoading}
              register={register}
              errors={errors}
            />
            <Button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              className="font-light"
            >
              Change Password
            </Button>
          </div>
        </AccountCard>

        <div className="pt-8 pb-20 flex justify-center">
          <AlertDialog>
            <AlertDialogTrigger className="h-9 px-4 py-2 text-white bg-red-500 rounded-md w-fit">
              Delete Account
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-black rounded-lg px-4 py-4 w-fit ">
              <AlertDialogHeader className="text-3xl">
                Are you sure?
              </AlertDialogHeader>
              <AlertDialogDescription className="text-white pt-2">
                We cannot recover a user after it has been deleted, this is
                irreversible. All information related to this account will be
                deleted permanently.
              </AlertDialogDescription>

              <AlertDialogFooter className="flex items-center justify-start gap-x-5 pt-3">
                <AlertDialogAction
                  className="shadow-none bg-red-600 text-3xl hover:bg-red-700 text-md"
                  onClick={onDelete}
                >
                  Yes, I&apos;m sure
                </AlertDialogAction>
                <AlertDialogCancel className=" shadow-none bg-green-600 text-3xl hover:bg-green-700 text-md text-white border-none hover:text-white m-0">
                  Nevermind
                </AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </>
  );
};

export default Page;
