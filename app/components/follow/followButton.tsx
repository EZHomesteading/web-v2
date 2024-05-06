"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import UnfollowIcon from "../icons/unfollow-svg";
import FollowIcon from "../icons/follow-svg";

interface FollowButtonProps {
  followUserId: any;
  following: any;
}
const FollowButton = ({ followUserId, following }: FollowButtonProps) => {
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

  if (checkStringMatch(followUserId, following.follows) === false) {
    const handleFollow = async () => {
      const resp = await axios.post(`/api/follow/`, {
        follows: followUserId,
      });
      router.refresh();
      console.log(resp);
    };

    return (
      <div onClick={handleFollow}>
        {" "}
        <FollowIcon />{" "}
      </div>
    );
  } else {
    const handleFollow = async () => {
      const resp = await axios.post(`/api/follow/unfollow`, {
        follows: followUserId,
      });
      router.refresh();
      console.log(resp);
    };
    return (
      <div onClick={handleFollow}>
        <UnfollowIcon />
      </div>
    );
  }
};

export default FollowButton;
