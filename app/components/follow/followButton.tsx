"use client";
//follow button component
import axios from "axios";
import { useRouter } from "next/navigation";
import UnfollowIcon from "../icons/unfollow-svg";
import FollowIcon from "../icons/follow-svg";
import { Outfit } from "next/font/google";
import { toast } from "sonner";

const outfit = Outfit({
  display: "swap",
  subsets: ["latin"],
  weight: ["300"],
});

interface FollowButtonProps {
  followUserId: any;
  following: any;
  user: any;
}

const FollowButton = ({ followUserId, following, user }: FollowButtonProps) => {
  const router = useRouter();
  function checkStringMatch(str: any, arr: any) {
    if (typeof str !== "string" || !Array.isArray(arr)) {
      throw new Error(
        "Invalid input: str must be a string and arr must be an array"
      );
    }
    const lowercaseStr = str.toLowerCase();
    const matchFound = arr.some((item) => item.toLowerCase() === lowercaseStr);
    return matchFound;
  }

  if (
    following === null ||
    following === undefined ||
    checkStringMatch(followUserId, following.follows) === false
  ) {
    const handleFollow = async () => {
      if (user?.id === undefined) {
        const callbackUrl = encodeURIComponent(window.location.href);
        router.push(`/auth/login?callbackUrl=${callbackUrl}`);
        return;
      } else if (user.id === followUserId) {
        toast.error("Can't follow yourself.");
        return;
      }
      await axios.post(`/api/follow/`, {
        follows: followUserId,
      });
      router.refresh();
    };

    return (
      <div
        onClick={handleFollow}
        className={`${outfit.className} bg-slate-300  rounded-full flex py-1 px-2 ml-1 hover:cursor-pointer items-center w-fit`}
      >
        <FollowIcon /> <div className="pl-1">Follow</div>
      </div>
    );
  } else {
    const handleUnfollow = async () => {
      await axios.post(`/api/follow/unfollow`, {
        follows: followUserId,
      });
      router.refresh();
    };

    return (
      <div
        onClick={handleUnfollow}
        className={`${outfit.className} bg-slate-300  rounded-full flex py-1 px-2 ml-1 hover:cursor-pointer items-center w-fit`}
      >
        <UnfollowIcon /> <div className="pl-1"> Following</div>
      </div>
    );
  }
};

export default FollowButton;
