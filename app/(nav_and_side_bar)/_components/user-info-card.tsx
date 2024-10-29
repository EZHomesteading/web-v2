"use client";

import Avatar from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/user/use-current-user";
import Link from "next/link";
interface p {
  sellerNav?: boolean;
}
const UserInfoCard = ({ sellerNav = false }: p) => {
  const user = useCurrentUser();
  const link = sellerNav ? `/store/${user?.url}` : `/profile/${user?.id}`;
  const link2 = sellerNav ? `/account` : `/selling`;
  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="text-3xl">
          {sellerNav ? "Seller Menu" : "Main Menu"}
        </div>
        {user?.role !== "CONSUMER" && (
          <Link href={link2}>
            <Button
              className={` ${
                user?.role === "COOP"
                  ? "bg-blue-700 text-white rounded-full "
                  : user?.role === "PRODUCER"
                  ? "bg-emerald-700 text-white rounded-full animated-gradient-text transition-colors"
                  : "hidden"
              }`}
            >
              {sellerNav ? "Switch to Buying" : "Switch to Selling"}
            </Button>
          </Link>
        )}
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
      {/* <style jsx global>{`
        @keyframes gradientMove {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animated-gradient-text {
          background-image: linear-gradient(
            to right,
            #4ade80,
            #22d3ee,
            #60a5fa,
            #22d3ee,
            #4ade80
          );
          background-size: 200% auto;
          color: transparent;
          background-color: black;
          -webkit-background-clip: text;
          background-clip: text;
          animation: gradientMove 6s linear infinite;
          font-weight: bold;
        }
      `}</style> */}
    </div>
  );
};
export default UserInfoCard;
