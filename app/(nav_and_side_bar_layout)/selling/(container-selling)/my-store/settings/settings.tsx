import { Button } from "@/components/ui/button";
import { Location, UserRole } from "@prisma/client";
import Link from "next/link";
import { IoStorefrontOutline } from "react-icons/io5";
import { GiFruitTree } from "react-icons/gi";
import { CiCircleInfo } from "react-icons/ci";
import HoursLocationContainer from "./location-hours-container";
import { UserInfo } from "next-auth";

interface p {
  apiKey: string;
  locations: Location[];
  user?: UserInfo;
}

const StoreSettings = ({ apiKey, locations = [], user }: p) => {
  if (user?.role === UserRole.CONSUMER) {
    return (
      <div className="p-6">
        <div>
          <div>Why is this page empty?</div>
          <div className="relative w-fit">
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
        <HoursLocationContainer
          locations={locations}
          apiKey={apiKey}
          role={user?.role}
          id={user?.id}
        />
      </div>
    );
};

export default StoreSettings;
