"use client";
//settings page
import { Button } from "@/app/components/ui/button";
import { useCurrentUser } from "@/hooks/user/use-current-user";
import { Card, CardContent, CardFooter } from "@/app/components/ui/card";
import { useState } from "react";
import { FieldValues, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import { UserRole } from "@prisma/client";
import Link from "next/link";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import Image from "next/image";
import { Outfit } from "next/font/google";
import { UploadButton } from "@/utils/uploadthing";
import { Textarea } from "@/app/components/ui/textarea";
import { IoStorefrontOutline } from "react-icons/io5";
import { GiFruitTree } from "react-icons/gi";
import { CiCircleInfo } from "react-icons/ci";
import homebg from "@/public/images/website-images/ezh-modal.jpg";
import HoursLocationContainer from "./location-hours-container";

const outfit = Outfit({
  display: "swap",
  subsets: ["latin"],
});
interface p {
  apiKey: string;
}
const StoreSettings = ({ apiKey }: p) => {
  const user = useCurrentUser();

  const [banner, setBanner] = useState(user?.banner || "");
  const [SODT, setSODT] = useState(user?.SODT || 0);
  const [bio, setBio] = useState(user?.bio);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const formData = {
      SODT: SODT,
      bio: bio,
      banner: banner,
      location: user?.location
        ? Object.entries(user.location).map(([key, value]) => ({
            ...value,
          }))
        : {},
    };
    console.log("beans", formData);
    axios
      .post("/api/update", formData)
      .then(() => {
        window.location.replace("/dashboard/my-store");
        toast.success("Your account details have changed");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  if (user?.role === UserRole.CONSUMER) {
    return (
      <div className="p-6">
        <div>
          <div>Why is this page empty?</div>
          <div className="relative w-fit">
            <div className="relative hidden xl:block">
              <Image
                src={homebg}
                alt="Farmer Holding Basket of Vegetables"
                placeholder="blur"
                className="rounded-l-lg object-cover"
                fill
              />
            </div>
            <div className="mt-12 px-2">
              <div>
                <div className="text-black lg:text-2xl">
                  Would you like to become an EZH producer or co-op?
                </div>
                <div className="text-black text-xs">
                  You have to be a producer or co-op to add a product. There's
                  no registration fee and and can be done in a few seconds.
                </div>
              </div>

              <div className="mt-10 flex flex-col sm:flex-row gap-5">
                <Link
                  href="/info/ezh-roles"
                  className="flex flex-row items-center gap-x-2"
                >
                  <Button className="bg shadow-xl text-black">
                    <CiCircleInfo className="mr-2" />
                    More Info
                  </Button>
                </Link>

                <Link
                  href="/auth/become-a-co-op"
                  className="flex flex-row items-center text-black gap-x-2"
                >
                  <Button className="bg shadow-xl text-black">
                    <IoStorefrontOutline className="mr-2" />
                    Become a Co-op
                  </Button>
                </Link>

                <Link
                  href="/auth/become-a-producer"
                  className="flex flex-row items-center text-black gap-x-2"
                >
                  <Button className="bg shadow-xl text-black">
                    <GiFruitTree className="mr-2" />
                    Become a Producer
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else
    return (
      <div className="flex flex-col gap-y-8 px-2 2xl:px-40 mb-8">
        <h1 className="sr-only">Store Settings</h1>
        <div className="w-full flex justify-between items-center mt-1">
          {user?.role === UserRole.COOP ? (
            <h2 className="text-base font-semibold leading-7">
              Co-op Store Settings
            </h2>
          ) : (
            <h2 className="text-base font-semibold leading-7">
              Producer Store Settings
            </h2>
          )}
          <Button onClick={onSubmit}>Update</Button>
        </div>
        <Card>
          <CardContent className="flex flex-col sheet  border-none shadow-lg w-full pt-2">
            {/* {user?.role === UserRole.COOP ? (
              <h2 className="lg:text-3xl text-lg">Open & Close Hours</h2>
            ) : (
              <h2 className="lg:text-3xl text-lg">Delivery Hours</h2>
            )}

            <ul>
              {user?.role === UserRole.COOP ? (
                <li>
                  The hours when a producer can drop produce off and buyers can
                  pick up from your listing or co-op location.
                </li>
              ) : (
                <li>The hours you can deliver to a co-op.</li>
              )}
              <li>Please refresh after clicking update to see changes</li>
            </ul> */}
            <HoursLocationContainer location={user?.location} apiKey={apiKey} />
            <CardFooter className="flex justify-between m-0 p-0 pt-2">
              If you set hours to closed everyday, EZH users will not be able to
              buy from you.
            </CardFooter>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col sheet pt-2 border-none shadow-lg w-full">
            {user?.role === UserRole.COOP ? (
              <h2 className="lg:text-3xl text-lg">Set Out Time</h2>
            ) : (
              <h2 className="lg:text-3xl text-lg">Time to Begin Delivery</h2>
            )}
            <ul>
              {user?.role === UserRole.COOP ? (
                <li>
                  This is the amount of time it takes between you{" "}
                  <em>agreeing </em> to a pick up time and preparing the order.
                </li>
              ) : (
                <li>
                  This is the amount of time it takes between you{" "}
                  <em>agreeing to delivery time</em> and preparing it for
                  delivery.
                </li>
              )}
              <li>
                This is important to understand.{" "}
                <Link href="/info/sodt" className="text-blue-500">
                  More Info
                </Link>
              </li>
            </ul>
            <div className="justify-end flex">
              <label
                htmlFor="sodt"
                className="block text-sm font-medium leading-6"
              ></label>

              <Select
                onValueChange={(value) => setSODT(parseInt(value, 10))}
                value={SODT.toString()}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={user?.SODT || "Select a Time"} />
                </SelectTrigger>
                <SelectContent className={`${outfit.className} sheet`}>
                  <SelectGroup>
                    <SelectItem value="15">15 Minutes</SelectItem>
                    <SelectItem value="30">30 Minutes</SelectItem>
                    <SelectItem value="45">45 Minutes</SelectItem>
                    <SelectItem value="60">1 Hour</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <CardFooter className="flex justify-between m-0 p-0 pt-2">
              This is required for your role.
            </CardFooter>
          </CardContent>
        </Card>{" "}
        <Card>
          <CardContent className="flex flex-col sheet pt-2 border-none shadow-lg w-full">
            <h2 className="lg:text-3xl text-lg">Bio</h2>
            <ul>
              <li className="my-1">
                Basic description of you and your store. (200 characters max)
              </li>
            </ul>
            <div className="justify-center flex">
              <Textarea
                maxLength={200}
                value={bio ?? ""}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <CardFooter className="flex justify-between m-0 p-0 pt-2">
              A bio is recommended but not required
            </CardFooter>
          </CardContent>
        </Card>{" "}
        <Card>
          <CardContent className="flex flex-col sheet border-none shadow-lg w-full relative">
            <div className="m-0 p-0 pt-2">
              <div className="flex justify-between">
                <h1 className="text-lg lg:text-3xl">Store Banner Image</h1>
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res: any) => {
                    setBanner(res[0].url);
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
                      if (ready) return <div>Upload a Banner</div>;
                      return "Getting ready...";
                    },
                  }}
                />
              </div>
              {!banner ? (
                <>You do not have a banner yet.</>
              ) : (
                <>
                  <ul>
                    <li>
                      This is your current store banner, which is visible on
                      your store
                    </li>
                    <li>Click update after upload finishes to see changes</li>
                  </ul>
                  <div className="w-full pt-2 flex justify-center">
                    <div
                      className="w-[90vw] sm:w-[70vw] lg:w-[50vw] relative"
                      style={{ aspectRatio: "8/1" }}
                    >
                      <Image
                        src={
                          user?.banner ||
                          "/images/website-images/banner-example.jpg"
                        }
                        alt="Banner"
                        fill
                        className="object-fit"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            <CardFooter className="m-0 p-0 pt-2">
              A store banner is optional but recommended.
            </CardFooter>
          </CardContent>
        </Card>
      </div>
    );
};

export default StoreSettings;
