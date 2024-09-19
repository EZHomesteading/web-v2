"use client";
//general account settings page
import axios from "axios";
import { toast } from "sonner";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Input from "./input";
import { useCurrentUser } from "@/hooks/user/use-current-user";
import { useEffect, useState } from "react";
import LocationSearchInput from "@/app/components/map/LocationSearchInputSettings";
import { Button } from "@/app/components/ui/button";
import { UserRole } from "@prisma/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import Avatar from "@/app/components/Avatar";
import { UploadButton } from "@/utils/uploadthing";
import PhoneInput from "react-phone-number-input";
import AccountCard from "./account-card";

interface Props {
  apiKey: string;
}
const Page = ({ apiKey }: Props) => {
  const user = useCurrentUser();
  const [isLoading, setIsLoading] = useState(false);
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const router = useRouter();
  let fullAddress = "";
  const [addressFields, setAddressFields] = useState({
    street: user?.location?.[0]?.address?.[0] || "",
    city: user?.location?.[0]?.address?.[1] || "",
    state: user?.location?.[0]?.address?.[2] || "",
    zip: user?.location?.[0]?.address?.[3] || "",
  });
  if (user?.location && user.location[0]?.address) {
    const addressArray = user.location[0].address;
    fullAddress = addressArray
      .filter((element) => element && element.trim())
      .join(", ");
  }

  type AddressComponents = {
    street: string;
    city: string;
    state: string;
    zip: string;
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      oldPass: null,
      newPass: null,
      verifNewPass: null,
      phoneNumber: user?.phoneNumber,
      email: user?.email,
      role: user?.role,
      name: user?.name,
      image: user?.image,
      street: user?.location?.[0]?.address?.[0] || "",
      city: user?.location?.[0]?.address?.[1] || "",
      state: user?.location?.[0]?.address?.[2] || "",
      zip: user?.location?.[0]?.address?.[3] || "",
    },
  });

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

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if ((data.newPass, data.oldPass, data.verifNewPass)) {
      const password: string = data.oldPass;
      const password2: string = data.newPass;
      if (data.newPass === data.verifNewPass) {
        if (!user || !user.email) {
          return;
        }

        const email: string = user.email;

        const response = await axios.post("/api/auth/verifypass", {
          password,
          email,
        });

        const data = await response.data;
        if (data.isValid === false) {
          toast.error("Old Password is incorrect");
          return;
        }
        if (data.isValid === true) {
          const response2 = await axios.post(
            "/api/auth/verifypass/updatepass",
            {
              password2,
              email,
            }
          );
          const datas = await response2.data;
          if (datas.success === "Password updated!") {
            toast.error("Password updated!");
          }
        }
      } else {
        toast.error("passwords do not match");
        return;
      }
    }
    if (
      fullAddress !== `${data.street}, ${data.city}, ${data.state}, ${data.zip}`
    ) {
      fullAddress = `${data.street}, ${data.city}, ${data.state}, ${data.zip}`;
    }
    if (fullAddress !== ", , , ") {
      if (user?.location && Object.entries(user.location).length === 0) {
      }
      const geoData = await getLatLngFromAddress(fullAddress);
      setIsLoading(true);
      if (geoData) {
        const formData = {
          image: image,
          name: data.name,
          email: data.email,
          phoneNumer: data.phoneNumber,
          location:
            (user?.location && Object.entries(user.location).length === 0) ||
            user?.location === undefined ||
            user?.location === null
              ? {
                  0: {
                    type: "Point",
                    coordinates: [geoData.lng, geoData.lat],
                    address: [data.street, data.city, data.state, data.zip],
                    hours: null,
                  },
                }
              : {
                  0: {
                    type: "Point",
                    coordinates: [geoData.lng, geoData.lat],
                    address: [data.street, data.city, data.state, data.zip],
                    hours: user?.location[0]?.hours
                      ? user?.location[0]?.hours
                      : null,
                  },
                },
        };
        axios
          .post("/api/useractions/update", formData)
          .then(() => {
            router.refresh();
            toast.success("Your account details have changed");
          })
          .catch((error) => {
            toast.error(error);
          })
          .finally(() => {
            // window.location.reload();
            setIsLoading(false);
            return;
          });
      } else {
        const formData = {
          image: image,
          name: data.name,
          email: data.email,
          phoneNumer: data.phoneNumber,
        };
        axios
          .post("/api/useractions/update", formData)
          .then(() => {
            router.refresh();
            toast.success("Your account details have changed");
          })
          .catch((error) => {
            toast.error(error);
          })
          .finally(() => {
            // window.location.reload();
            setIsLoading(false);
          });
      }
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
  const [address, setAddress] = useState("");
  const handleAddressSelect = ({
    street,
    city,
    state,
    zip,
  }: AddressComponents) => {
    setAddress(street); // Set only the street in the main input
    setValue("street", street);
    setValue("city", city);
    setValue("state", state);
    setValue("zip", zip);
  };
  const [image, setImage] = useState(user?.image);
  useEffect(() => {
    Object.entries(addressFields).forEach(([key, value]) => {
      setValue(key, value);
    });
  }, [addressFields, setValue]);
  return (
    <div className="flex flex-col px-2  mb-8 sm:px-20 md:px-40 2xl:px-80 bg-inherit ">
      <h1 className="sr-only">Personal Info</h1>
      <header className="flex flex-row justify-between items-center mt-1">
        <h2 className="text-2xl font-medium">Personal Info</h2>
      </header>

      <AccountCard
        title="Username"
        info={user?.name || "No Username Saved"}
        onSave={handleSubmit(onSubmit)}
        isEditing={editingCard === "Username"}
        onEditStart={() => setEditingCard("Username")}
        onEditCancel={() => setEditingCard(null)}
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
        info={user?.email || "No Email Saved"}
        onSave={handleSubmit(onSubmit)}
        isEditing={editingCard === "Email"}
        onEditStart={() => setEditingCard("Email")}
        onEditCancel={() => setEditingCard(null)}
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
        info={user?.phoneNumber || "No Phone Number Saved"}
        onSave={() => handleSubmit(onSubmit)}
        isEditing={editingCard === "phoneNumber"}
        onEditStart={() => setEditingCard("phoneNumber")}
        onEditCancel={() => setEditingCard(null)}
        isDisabled={editingCard !== null && editingCard !== "phoneNumber"}
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
        info={fullAddress || "No Address Saved"}
        onSave={() => {}}
        isEditing={editingCard === "Address"}
        onEditStart={() => setEditingCard("Address")}
        onEditCancel={() => setEditingCard(null)}
        isDisabled={editingCard !== null && editingCard !== "Address"}
      >
        <>
          <LocationSearchInput
            apiKey={apiKey}
            address={address}
            setAddress={setAddress}
            onAddressParsed={handleAddressSelect}
          />
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Input
              id="apt"
              label="Apt, suite. (optional)"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
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
        info={user?.image}
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
            label="Current Password"
            disabled={isLoading}
            register={register}
            errors={errors}
          />
          <Input
            id="newPass"
            label="New Password"
            disabled={isLoading}
            register={register}
            errors={errors}
          />
          <Input
            id="verifNewPass"
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

      <div className="py-8 flex justify-center border-b-[1px]">
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
  );
};

export default Page;
