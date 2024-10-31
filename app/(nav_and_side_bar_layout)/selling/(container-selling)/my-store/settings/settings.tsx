"use client";
//settings page
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FieldValues, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import { Location, UserRole } from "@prisma/client";
import Link from "next/link";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { IoStorefrontOutline } from "react-icons/io5";
import { GiFruitTree } from "react-icons/gi";
import { CiCircleInfo } from "react-icons/ci";
import homebg from "@/public/images/website-images/ezh-modal.jpg";
import HoursLocationContainer from "./location-hours-container";
import { UserInfo } from "next-auth";
import AccountCard from "@/app/(nav_and_side_bar_layout)/account/(sidebar-container)/personal-info/account-card";
import { outfitFont } from "@/components/fonts";

interface p {
  apiKey: string;
  locations: Location[];
  user?: UserInfo;
}
const StoreSettings = ({ apiKey, locations = [], user }: p) => {
  const [SODT, setSODT] = useState(user?.SODT || 0);
  const [bio, setBio] = useState(user?.bio);

  const onSubmit: SubmitHandler<FieldValues> = async () => {
    const formData = {
      SODT: SODT,
      bio: bio,
    };
    axios.post("/api/useractions/update", formData).catch((error) => {
      toast.error(error.message);
    });
  };
  const [editingCard, setEditingCard] = useState<string | null>(null);
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
      <div className="flex flex-col mb-8 2xl:w-1/2 px-1 md:p-2 lg:p-4 xl:p-6">
        <h1 className="sr-only">Store Settings</h1>
        <div className="text-2xl font-medium pb-0">Store Settings</div>
        {user?.role && user?.id && (
          <HoursLocationContainer
            locations={locations}
            apiKey={apiKey}
            role={user?.role}
            id={user.id}
          />
        )}

        <AccountCard
          title="SODT"
          info={SODT ? `${SODT.toString()} minutes` : "No SODT Saved"}
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
            <SelectContent className={`${outfitFont.className} sheet`}>
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
            onSubmit({ bio });
          }}
          isEditing={editingCard === "bio"}
          onEditStart={() => handleEditStart("bio")}
          onEditCancel={handleEditCancel}
          isDisabled={editingCard !== null && editingCard !== "bio"}
        >
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
