"use client";

import Avatar from "@/components/Avatar";
import { UserInfo } from "next-auth";
import Link from "next/link";

interface p {
  sellerNav?: boolean;
  user?: UserInfo;
}

const UserInfoCard = ({ sellerNav = false, user }: p) => {
  const link = sellerNav ? `/store/${user?.url}` : `/profile/${user?.id}`;
  const link2 = sellerNav ? `/account` : `/selling`;
  return (
    <div className={`sticky top-0 py-1 md:top-20 w-full md:mb-20 sheet`}>
      <div className="flex justify-between items-center">
        <div className="text-3xl">
          {sellerNav ? "Seller Menu" : "Main Menu"}
        </div>
        {user?.role !== "CONSUMER" && (
          <Link
            href={link2}
            className={` bg-emerald-700 text-white rounded-full px-4 py-2 text-md font-medium
                 `}
          >
            {sellerNav ? "Switch to Buying" : "Switch to Selling"}
          </Link>
        )}
      </div>
      <div className="flex items-center justify-between mt-1">
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
        <Link
          href={link}
          className=" text-neutral-700 border rounded-full py-2 text-sm w-24 text-center font-medium !border-neutral-700"
        >
          View {sellerNav ? `Store` : `Profile`}
        </Link>
      </div>
    </div>
  );
};
export default UserInfoCard;
