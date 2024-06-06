"use client";
//follow button component
import axios from "axios";
import { useRouter } from "next/navigation";
import UnfollowIcon from "../icons/unfollow-svg";
import FollowIcon from "../icons/follow-svg";
import toast from "react-hot-toast";
import { Outfit } from "next/font/google";

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
  console.log(user?.id);
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
        router.push("/auth/login");
        return;
      } else if (user.id === followUserId) {
        toast.error("Can't follow yourself.");
        return;
      }
      const resp = await axios.post(`/api/follow/`, {
        follows: followUserId,
      });
      router.refresh();
      console.log(resp);
    };

    return (
      <div
        className={`${outfit.className} bg-slate-100 rounded-full flex py-1 px-2 ml-1 hover:cursor-pointer items-center`}
        onClick={handleFollow}
      >
        <FollowIcon />
        Follow
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
        className={`${outfit.className} bg-slate-100 rounded-full flex py-1 px-2 ml-1 hover:cursor-pointer items-center`}
      >
        <UnfollowIcon /> Unfollow
      </div>
    );
  }
};

export default FollowButton;
