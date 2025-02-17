"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import LocationSearchInput from "@/components/map/LocationSearchInputSettings";
import AccountCard from "./account-card";
import Input from "./input";
import { Button } from "@/components/ui/button";
import { UploadButton } from "@/utils/uploadthing";
import { FormValues, AddressFields } from "../../../../../types/address.types";
import { UserInfo } from "next-auth";
import { Location } from "@prisma/client";
import Alert from "@/components/ui/custom-alert";
import Toast from "@/components/ui/toast";

interface PageProps {
  apiKey: string;
  user?: UserInfo;
  locations: Location[] | null;
  location?: Location;
}

const Page: React.FC<PageProps> = ({ apiKey, user, location }) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [image, setImage] = useState<string | undefined>(user?.image);
  const [address, setAddress] = useState(location?.address?.join(", ") || "");
  const [addressFields, setAddressFields] = useState<AddressFields>({
    street: location?.address?.[0] || "",
    city: location?.address?.[1] || "",
    state: location?.address?.[2] || "",
    zip: location?.address?.[3] || "",
    apt: location?.address?.[4] || "",
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
    const formData = {
      image,
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
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

  const onSubmitLoc: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);

    const geoData = await getLatLngFromAddress(address);

    const addressArray = [
      addressFields.street,
      addressFields.city,
      addressFields.state,
      addressFields.zip,
      addressFields.apt,
    ];

    const formData = {
      address: addressArray,
      locationId: location?.id,
      coordinates: [geoData?.lat, geoData?.lng],
      hours: location?.hours || null,
      role: location?.role || "COOP",
      isDefault: location?.isDefault,
      displayname: location?.displayName,
    };
    console.log(formData);
    try {
      await axios.post("/api/useractions/update/location-hours", formData);
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
      setAddress(location?.address?.join(", ") || "");
      setAddressFields({
        street: location?.address?.[0] || "",
        apt: "",
        city: location?.address?.[1] || "",
        state: location?.address?.[2] || "",
        zip: location?.address?.[3] || "",
      });
    }
  };
  const onDelete = () => {
    axios
      .delete(`/api/auth/register/${user?.id}`)
      .then(() => {
        Toast({ message: "Your account has been deleted" });
      })
      .catch((error) => {
        toast.error(error?.response?.data?.error);
      })
      .finally(() => {
        router.replace("/");
      });
  };
  return (
    <>
      <div className="mb-20 flex flex-col md:w-1/2">
        <h2 className="text-2xl font-medium pb-0 md:pl-8 px-1">
          Personal Info
        </h2>

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
          title="Primary Address"
          info={
            truncateAddress(
              `${watchedFields.street}${
                watchedFields.apt ? ", " + watchedFields.apt : ""
              }, ${watchedFields.city}, ${watchedFields.state}, ${
                watchedFields.zip
              }`
            ) || "No Address Saved"
          }
          onSave={handleSubmit(onSubmitLoc)}
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
            </div>
          </>
        </AccountCard>
        <AccountCard
          title="Profile Image"
          info={image}
          showAvatar={true}
          onSave={handleSubmit(onSubmit)}
          isEditing={editingCard === "Image"}
          onEditStart={() => setEditingCard("Image")}
          onEditCancel={() => setEditingCard(null)}
          isDisabled={editingCard !== null && editingCard !== "Image"}
        >
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
        {/* <AccountCard
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
        </AccountCard> */}
        <p className={`text-center mt-10 text-red-500 underline`}>
          Danger Zone
        </p>
        <Alert
          alertTriggerText="Delete Account"
          headingText="Are you sure?"
          subtitleText="We cannot recover a user after it has been deleted, this is
                irreversible. All information related to this account will be
                deleted permanently."
          cancelButtonText="Cancel"
          confirmButtonText="Delete my Account"
          alertContentClassName="px-1"
          alertTriggerClassName="w-80 mx-auto mb-10 py-2"
          onClick={onDelete}
        />
      </div>
    </>
  );
};

export default Page;
