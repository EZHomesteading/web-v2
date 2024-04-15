import { UserInfo } from "@/next-auth";
import Link from "next/link";
import Avatar from "../Avatar";
import { StarIcon } from "@radix-ui/react-icons";
interface UserCardProps {
  user: any;
}
const UserCard = ({ user }: UserCardProps) => {
  //   let listingsCount;
  //   if (user?.listings.length > 0) {
  //     listingsCount = user?.listings.length;
  //   } else {
  //     listingsCount = 0;
  //   }
  return (
    <>
      <Link href={`/store/${user?.id}`}>
        <div className="relative border-2 border-gray h-1/10 rounded-md px-2 py-2 m-2">
          <div className="flex flex-row gap-x-2">
            <Avatar />
            <div className="flex flex-col">
              {" "}
              <div>
                {" "}
                {user?.name} <span className="text-xs">(5)</span>
              </div>
              <div className="text-xs">
                {user?.city}, {user?.state} {user?.zip}
              </div>
              <div className="text-xs">Open</div>
            </div>
          </div>{" "}
          <div className="flex flex-row justify-center">
            <div className="absolute right-2 top-2">
              <StarIcon />
              {/* <div className="flex flex-row">1</div> */}
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};

export default UserCard;
