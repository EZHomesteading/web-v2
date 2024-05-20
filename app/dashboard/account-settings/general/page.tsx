"use client";

import axios from "axios";
import { toast } from "react-hot-toast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Input from "@/app/components/inputs/Input";
import { useCurrentUser } from "@/hooks/user/use-current-user";
import { useState } from "react";
import LocationSearchInput from "@/app/components/map/LocationSearchInput";
import { Card, CardContent, CardFooter } from "@/app/components/ui/card";
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
import ImageUpload from "@/app/components/inputs/profile-img-upload";
import { useRouter } from "next/navigation";
import Avatar from "@/app/components/Avatar";
import { UploadButton } from "@/utils/uploadthing";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Page = () => {
  const user = useCurrentUser();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [fullAddress, setFullAddress] = useState(
    `${user?.location?.address[0]}, ${user?.location?.address[1]}, ${user?.location?.address[2]}, ${user?.location?.address[3]}`
  );
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
      phoneNumber: user?.phoneNumber,
      email: user?.email,
      role: user?.role,
      name: user?.name,
      image: user?.image,
    },
  });
  setValue("street", user?.location?.address[0]);
  setValue("city", user?.location?.address[1]);
  setValue("state", user?.location?.address[2]);
  setValue("zip", user?.location?.address[3]);
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
    if (
      fullAddress !== `${data.street}, ${data.city}, ${data.state}, ${data.zip}`
    ) {
      setFullAddress(
        `${data.street}, ${data.city}, ${data.state}, ${data.zip}`
      );
    }
    if (fullAddress !== "") {
      const geoData = await getLatLngFromAddress(fullAddress);
      setIsLoading(true);

      if (geoData) {
        const formData = {
          ...data,
          location: {
            type: "Point",
            coordinates: [geoData.lng, geoData.lat],
            address: [data.street, data.city, data.state, data.zip],
          },
        };
        axios
          .post("/api/update", formData)
          .then(() => {
            router.refresh();
            toast.success("Your account details have changed");
          })
          .catch((error) => {
            toast.error(error);
          })
          .finally(() => {
            setIsLoading(false);

            return;
          });
      } else
        axios
          .post("/api/update", data)
          .then(() => {
            router.refresh();
            toast.success("Your account details have changed");
          })
          .catch((error) => {
            toast.error(error);
          })
          .finally(() => {
            setIsLoading(false);
          });
    }
  };

  const onDelete = () => {
    axios
      .delete(`/api/register/${user?.id}`)
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
  const handleImageChange = (value: string) => {
    setValue("image", value);
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
  const [image, setImage] = useState(user?.image);
  return (
    <div className="flex flex-col gap-y-8 px-2 lg:px-40 mb-8">
      <h1 className="sr-only">Account Settings</h1>
      <h2 className="text-base font-semibold leading-7 mt-2">
        Personal Information
      </h2>
      <Card>
        <CardContent className="flex flex-col sheet  border-none shadow-lg w-full">
          <div className="flex flex-row items-center justify-between m-0 p-0 pt-2">
            <div>
              <h1 className="text-lg lg:text-3xl">Profile Image</h1>
              <ul>
                <li>This is your current profile image.</li>
                <li>
                  Click on the image to upload a custom one from your device.
                  Press save after clicking upload even if the image doesnt
                  change at first.
                </li>
              </ul>
            </div>{" "}
            <Avatar image={image} />
          </div>

          <CardFooter className="flex justify-between m-0 p-0 pt-2">
            A profile picture is optional but we recommend it.
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res: any) => {
                setImage(res[0].url);
              }}
              onUploadError={(error: Error) => {
                alert(`ERROR! ${error.message}`);
              }}
              className="ut-allowed-content:hidden ut-button:bg-white ut-button:text-black ut-button:w-fit ut-button:px-2 ut-button:h-full"
              content={{
                button({ ready }) {
                  if (ready) return <div>Upload Profile Image</div>;
                  return "Getting ready...";
                },
              }}
            />
          </CardFooter>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex flex-col sheet  border-none shadow-lg w-full">
          <h2 className="lg:text-3xl text-lg">Username</h2>
          <ul>
            <li>This name is unique to you & visible to other users.</li>
            <li>Type in a new username to change it.</li>
          </ul>
          <div className="flex justify-end">
            <Input
              id="name"
              label="Username"
              disabled={isLoading}
              register={register}
              errors={errors}
              isUsername={true}
              required
            />
          </div>

          <CardFooter className="flex justify-between m-0 p-0 pt-2">
            A username is required.
            <Button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              className="rounded-md bg-green-700 px-3 py-2 text-sm font-semibold shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
            >
              Save
            </Button>
          </CardFooter>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex flex-col sheet  border-none shadow-lg w-full">
          <h3 className="text-lg lg:text-3xl">Email Address</h3>
          <ul>
            <li>This email address is unique to your account.</li>
            <li>Type in a new email to change it.</li>
          </ul>
          <div className="justify-end flex">
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6"
            ></label>
            <Input
              id="email"
              label="Email address"
              disabled={isLoading}
              register={register}
              errors={errors}
              isEmail={true}
              required
            />
          </div>

          <CardFooter className="flex justify-between m-0 p-0 pt-2">
            An email address is required.
            <Button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              className="rounded-md bg-green-700 px-3 py-2 text-sm font-semibold shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
            >
              Save
            </Button>
          </CardFooter>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex flex-col sheet  border-none shadow-lg w-full">
          <h4 className="text-lg lg:text-3xl">Phone number</h4>
          <ul>
            <li>Type in a new phone number to change it.</li>
          </ul>
          <div className="flex justify-end">
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium leading-6"
            ></label>
            <Input
              id="phoneNumber"
              label="Phone Number"
              disabled={isLoading}
              register={register}
              errors={errors}
            />
          </div>
          <CardFooter className="flex justify-between m-0 p-0 pt-2">
            {user?.role == UserRole.COOP || user?.role == UserRole.PRODUCER ? (
              <>A phone number is required for your account type.</>
            ) : (
              <>A phone number is not required.</>
            )}
            <Button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              className="rounded-md bg-green-700 px-3 py-2 text-sm font-semibold shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
            >
              Save
            </Button>
          </CardFooter>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex flex-col sheet  border-none shadow-lg w-full">
          <h5 className="text-lg lg:text-2xl">Address</h5>
          <ul>
            <li>
              {user?.role == UserRole.COOP ||
              user?.role == UserRole.PRODUCER ? (
                <>This is your default selling location.</>
              ) : (
                <></>
              )}
            </li>
          </ul>
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium leading-6"
            >
              {!user?.location?.address ? (
                <>You do not currently have a saved address</>
              ) : (
                `Your current address is${" "}${user?.location?.address[0]}, ${
                  user?.location?.address[1]
                },${" "}
                  ${user?.location?.address[2]}, ${user?.location?.address[3]}`
              )}
            </label>
            <label
              htmlFor="address"
              className="block text-sm font-medium leading-6"
            >
              To change this, enter a new address
            </label>
            <div className="flex justify-end">
              <LocationSearchInput
                address={watch("address")}
                setAddress={(address) => setValue("address", address)}
                onAddressParsed={handleAddressSelect}
              />
            </div>
          </div>
          <CardFooter className="flex justify-between m-0 p-0 pt-2">
            {user?.role == UserRole.COOP || user?.role == UserRole.PRODUCER ? (
              <>
                An address is required for your account type to prevent
                fradulence.
              </>
            ) : (
              <>
                An address is not required for your account type, but will
                improve your experience on EZH.
              </>
            )}
            <Button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              className="rounded-md bg-green-700 px-3 py-2 text-sm font-semibold shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
            >
              Save
            </Button>
          </CardFooter>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="sheet shadow-lg">
          <div className="text-base font-semibold leading-7">
            Delete account
          </div>
          <p className="mt-1 text-sm text-gray-400 mb-2">
            No longer want to use EZHomesteading? You can delete your account
            here. This action is not reversible. All information related to this
            account will be deleted permanently including listed products for
            Co-Ops and Producers.
          </p>
          <AlertDialog>
            <AlertDialogTrigger className="px-2 py-2 bg-red-500 rounded-xl">
              Delete
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-black rounded-lg px-4 py-4 w-fit ">
              <AlertDialogHeader className="text-3xl">
                Are you sure?
              </AlertDialogHeader>
              <AlertDialogDescription className="text-white pt-2">
                We cannot recover a user after it has been deleted, this is
                irreversible.
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
