"use client";

import Avatar from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { UserRole } from "@prisma/client";
import { User, UserInfo } from "next-auth";
import Link from "next/link";

interface p {
  sellerNav?: boolean;
  user?: UserInfo;
}

const UserInfoCard = ({ sellerNav = false, user }: p) => {
  const link = sellerNav ? `/store/${user?.url}` : `/profile/${user?.id}`;
  return (
    <>
      <div className="flex justify-between items-center">
        <div className="text-3xl">
          {sellerNav ? "Seller Menu" : "Main Menu"}
        </div>
      </div>
      <div className="flex items-center justify-between py-6">
        <div className="flex items-center justify-start">
          <Avatar image={user?.image} h={`12`} />
          <Link href={link}>
            <div className="ml-1">
              <div>
                {user?.name}
                <div className="text-xs text-neutral-700">
                  {user?.fullName?.first}
                </div>
              </div>
            </div>
          </Link>
        </div>
        <Link href={link} className=" text-neutral-700">
          <Button className="bg-inherit text-xs p-1" variant={`outline`}>
            View {sellerNav ? `Store` : `Profile`}
          </Button>
        </Link>
      </div>{" "}
    </>
  );
};

const SellAccountToggle = ({
  user,
  sellerNav = false,
}: {
  user?: UserInfo;
  sellerNav?: boolean;
}) => {
  const link2 = sellerNav ? `/account` : `/selling`;

  return (
    <>
      {user?.role !== UserRole.CONSUMER && (
        <Link
          href={link2}
          className={` 
             bg-emerald-800 text-white rounded-full animated-gradient-text transition-colors py-3 px-6 fixed bottom-32 translate-x-1/2 transform right-1/2 text-md font-medium
          `}
        >
          {sellerNav ? "Switch to Buying" : "Switch to Selling"}
        </Link>
      )}
    </>
  );
};

export { SellAccountToggle, UserInfoCard };
