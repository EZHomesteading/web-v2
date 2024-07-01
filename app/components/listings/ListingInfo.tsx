"use client";
//listing information component, displays user selling and follow button
import { UserInfo } from "@/next-auth";
import { useRouter } from "next/navigation";
import FollowButton from "../follow/followButton";
import Avatar from "../Avatar";
import { Outfit } from "next/font/google";
const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});
interface ListingInfoProps {
  user: UserInfo;
  description: string;
  followUserId: string;
  following:
    | {
        id: string;
        userId: string;
        follows: string[];
      }
    | null
    | undefined;
  listingUser: UserInfo;
}

const ListingInfo: React.FC<ListingInfoProps> = ({
  user,
  followUserId,
  following,
  listingUser,
}) => {
  const router = useRouter();

  return (
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
        <span style={{ marginRight: "5px" }} className={`${outfit.className}`}>
          Sold by
        </span>
        <span
          className="flex items-center gap-2 hover:cursor-pointer"
          onClick={() => router.push(`/store/${listingUser.url}`)}
        >
          <span className="mt-3">
            <Avatar image={listingUser?.image} />
          </span>
          <span>{listingUser?.name}</span>
        </span>
        <FollowButton followUserId={followUserId} following={following}/>
      </div>
    </div>
  );
};

export default ListingInfo;
