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
import { Textarea } from "@/app/components/ui/textarea";
import { IoStorefrontOutline } from "react-icons/io5";
import { GiFruitTree } from "react-icons/gi";
import { CiCircleInfo } from "react-icons/ci";
import homebg from "@/public/images/website-images/ezh-modal.jpg";
import HoursLocationContainer from "./location-hours-container";
import AccountCard from "@/app/account/(sidebar-container)/personal-info/account-card";

const outfit = Outfit({
  display: "swap",
  subsets: ["latin"],
});
interface p {
  apiKey: string;
}
const StoreSettings = ({ apiKey }: p) => {
  const user = useCurrentUser();

  // const [banner, setBanner] = useState(user?.banner || "");
  const [SODT, setSODT] = useState(user?.SODT || 0);
  const [bio, setBio] = useState(user?.bio);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const formData = {
      SODT: SODT,
      bio: bio,
      // banner: banner,
    };
    axios
      .post("/api/useractions/update", formData)
      .then(() => {
        window.location.replace("/dashboard/my-store");
        toast.success("Your account details have changed");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };
  const [isLoading, setIsLoading] = useState(false);
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [image, setImage] = useState<string | undefined>(user?.image);
  const handleEditStart = (cardName: string) => {
    setEditingCard(cardName);
  };

  const handleEditCancel = () => {
    setEditingCard(null);
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
      <div className="flex flex-col mb-8">
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
          <Button
            type="submit"
            onClick={onSubmit}
            className="rounded-md bg-green-700 px-3 py-2 text-sm font-semibold shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
          >
            Save Changes
          </Button>
        </div>
        {user?.role && user?.id && (
          <HoursLocationContainer
            location={user?.location}
            apiKey={apiKey}
            role={user?.role}
            id={user.id}
          />
        )}

        <AccountCard
          title="SODT"
          info={SODT.toString() || "No SODT Saved"}
          onSave={() => {
            onSubmit;
          }}
          isEditing={editingCard === "SODT"}
          onEditStart={() => handleEditStart("SODT")}
          onEditCancel={handleEditCancel}
          isDisabled={editingCard !== null && editingCard !== "SODT"}
        >
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
        </AccountCard>
        <AccountCard
          title="Store Bio"
          info={bio || "No Bio Saved"}
          onSave={() => {
            onSubmit;
          }}
          isEditing={editingCard === "bio"}
          onEditStart={() => handleEditStart("bio")}
          onEditCancel={handleEditCancel}
          isDisabled={editingCard !== null && editingCard !== "bio"}
        >
          {" "}
          <Textarea
            maxLength={200}
            value={bio || ""}
            onChange={(e) => setBio(e.target.value)}
          />
        </AccountCard>
        <AccountCard
          title="Store Url"
          info={user?.url || "No Url Saved"}
          onSave={() => {
            onSubmit;
          }}
          isEditing={editingCard === "bio"}
          onEditStart={() => handleEditStart("bio")}
          onEditCancel={handleEditCancel}
          isDisabled={editingCard !== null && editingCard !== "bio"}
        >
          {" "}
          <Textarea
            maxLength={200}
            value={bio || ""}
            onChange={(e) => setBio(e.target.value)}
          />
        </AccountCard>
      </div>
    );
};

export default StoreSettings;
