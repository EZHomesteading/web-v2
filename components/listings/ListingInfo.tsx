"use client";
//listing information component, displays user selling and follow button
import { useRouter } from "next/navigation";
import FollowButton from "@/components/follow/followButton";
import Avatar from "@/components/Avatar";
import Link from "next/link";
import { UserInfo } from "next-auth";
import { outfitFont } from "../fonts";
interface ListingDataProps {
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

const ListingData: React.FC<ListingDataProps> = ({
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
        <span
          style={{ marginRight: "5px" }}
          className={`${outfitFont.className}`}
        >
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
        <FollowButton followUserId={followUserId} following={following} />

        <Link
          href={`/store/${listingUser.url}`}
          className="bg-slate-300 text-xl font-semibold rounded-full flex py-2 px-2 ml-1 hover:cursor-pointer items-center w-fit"
        >
          Go to Store
        </Link>
      </div>
    </div>
  );
};

export default ListingData;
