"use client";

import Avatar from "@/app/components/Avatar";
import { useCurrentUser } from "@/hooks/user/use-current-user";

const UserInfoCard = () => {
  const user = useCurrentUser();
  return (
    <div>
      <div className="text-3xl">Main Menu</div>
      <div className="flex items-center justify-start py-6">
        <Avatar image={user?.image} h={`12`} />
        <div className="ml-1">
          <div>{user?.firstName}</div>
          <div className="text-xs text-neutral-700">Go to Profile</div>
        </div>
      </div>
    </div>
  );
};
export default UserInfoCard;
