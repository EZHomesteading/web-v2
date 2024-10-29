"use client";
//following card component
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Outfit } from "next/font/google";
import FollowButton from "./followButton";
import { Prisma } from "@prisma/client";
import Avatar from "../Avatar";
import { Card, CardContent } from "../ui/card";

const outfit = Outfit({
  display: "swap",
  subsets: ["latin"],
  weight: ["300"],
});
interface ListingCardProps {
  data: {
    name: string;
    id: string;
    image: string | null;
    url: string | null;
    location: {
      0: {
        type: string;
        coordinates: number[];
        address: string[];
        hours: Prisma.JsonValue;
      } | null;
      1: {
        type: string;
        coordinates: number[];
        address: string[];
        hours: Prisma.JsonValue;
      } | null;
      2: {
        type: string;
        coordinates: number[];
        address: string[];
        hours: Prisma.JsonValue;
      } | null;
    } | null;
  } | null;
  followarr:
    | {
        id: string;
        userId: string;
        follows: string[];
      }
    | null
    | undefined;
}

const FollowCard: React.FC<ListingCardProps> = ({ data, followarr }) => {
  const router = useRouter();

  if (!data) {
    return null;
  }

  const truncateName = (name: string) => {
    if (name.length <= 10) return name;
    let truncated = name.slice(0, 10);
    truncated = truncated.replace(/\s+$/, "");
    return truncated + "...";
  };

  return (
    <Card
      className={`w-[215px] hover:shadow-lg transition-shadow duration-300 ${outfit.className}`}
    >
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <Avatar
            image={data.image || "/images/website-images/placeholder.jpg"}
          />
          <div className="flex-grow">
            <h3 className="font-semibold text-lg">{truncateName(data.name)}</h3>
            <Button
              variant="ghost"
              className="p-0 h-auto text-blue-500 hover:text-blue-700"
              onClick={() => router.push(`/profile/${data.id}`)}
            >
              View Profile
            </Button>
          </div>
        </div>
        <div className="mt-4 flex justify-center">
          <div className="relative">
            <FollowButton followUserId={data.id} following={followarr} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FollowCard;
