import Link from "next/link";
import Avatar from "../Avatar";
import { StarIcon } from "@radix-ui/react-icons";
import { Location, UserRole } from "@prisma/client";
import OpenStatus from "@/app/(pages)/store/[storeId]/status";
import { ExtendedHours } from "@/next-auth";

interface UserCardProps {
  user: {
    id: string;
    name: string;
    location: Location;
    listings?: Array<any>;
    hours: ExtendedHours;
    role: UserRole;
  };
}

const UserCard = ({ user }: UserCardProps) => {
  const listingsCount = user?.listings?.length || 0;
  return (
    <>
      <Link href={`/store/${user?.id}`}>
        <div className="relative border-2 border-gray h-1/10 rounded-md px-2 py-2">
          <div className="flex flex-row gap-x-2">
            <Avatar />
            <div className="flex flex-col">
              <div>
                {user?.name}
                <span className="text-xs">({listingsCount})</span>
              </div>
              <div className="text-xs">
                {user?.location?.address[1]}, {user?.location.address[2]}{" "}
              </div>
              <div className="text-xs">
                {user.role == UserRole.COOP && (
                  <OpenStatus hours={user?.hours} />
                )}
              </div>
            </div>
          </div>
          <div className="absolute right-1 top-1 flex items-center">
            <StarIcon />
            <span className="text-xs ml-1">(0)</span>
          </div>
        </div>
      </Link>
    </>
  );
};

export default UserCard;
