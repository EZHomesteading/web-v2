"use client";

import { UserInfo } from "@/next-auth";
import { useRouter } from "next/navigation";
import FollowButton from "../follow/followButton";

interface ListingInfoProps {
  user: UserInfo;
  description: string;
  followUserId: string;
  following: any;
}

const ListingInfo: React.FC<ListingInfoProps> = ({
  user,
  description,
  followUserId,
  following,
}) => {
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
            <span>{user?.name}</span>{" "}
          </span>
          <FollowButton
            followUserId={followUserId}
            following={following}
            user={user}
          />
        </div>
      </div>
    </div>
  );
};

export default ListingInfo;
