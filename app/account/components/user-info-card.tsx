"use client";

import Avatar from "@/app/components/Avatar";
import { Button } from "@/app/components/ui/button";
import { useCurrentUser } from "@/hooks/user/use-current-user";
import Link from "next/link";
interface p {
  sellerNav?: boolean;
}
const UserInfoCard = ({ sellerNav = false }: p) => {
  const user = useCurrentUser();
  const link = sellerNav ? `/store/${user?.url}` : `/profile/${user?.id}`;
  return (
    <div>
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
                  {user?.firstName}
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
      </div>
    </div>
  );
};
export default UserInfoCard;
