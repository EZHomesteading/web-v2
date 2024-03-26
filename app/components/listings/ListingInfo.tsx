"use client";

import { Avatar } from "@/app/components/ui/avatar";
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
          "
        >
          <span style={{ marginRight: "5px" }}>Sold by</span>
          <span
            className="flex items-center gap-2 hover:cursor-pointer"
            onClick={() => router.push(`/store/${user.id}`)}
          >
            <Avatar />
            <span>{user?.name}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ListingInfo;
