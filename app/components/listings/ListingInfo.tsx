"use client";

import Avatar from "../ui/Avatar";
import { SafeUser } from "@/app/types";
import { useRouter } from "next/navigation";

interface ListingInfoProps {
  user: SafeUser;
  description: string;
}

const ListingInfo: React.FC<ListingInfoProps> = ({ user, description }) => {
  const router = useRouter();

  return (
    <div className="col-span-4 flex flex-col gap-8">
      {" "}
      <div className="flex flex-col gap-2">
        {" "}
        <div
          className="
            text-xl 
            font-semibold 
            flex 
            flex-row 
            items-center
            gap-2
          "
        >
          <span style={{ marginRight: "5px" }}>Sold by</span>
          <span
            className="flex items-center gap-2 hover:cursor-pointer"
            onClick={() => router.push(`/store/${user.id}`)}
          >
            <Avatar src={user?.image} />
            <span className="ml-2">{user?.name}</span>
          </span>
        </div>
        <div
          className="
            flex 
            flex-row 
            items-center 
            gap-4 
            font-light
            text-neutral-500
          "
        ></div>
      </div>
      <hr />
      <div
        className="
      text-lg font-light text-neutral-500"
      >
        {description}
      </div>
      <hr />
    </div>
  );
};

export default ListingInfo;
