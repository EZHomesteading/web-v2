"use client";

import useActiveList from "@/hooks/messenger/useActiveList";
import Image from "next/image";

interface AvatarProps {
  image: any;
}

const Avatar: React.FC<AvatarProps> = ({ image }: AvatarProps) => {
  return (
    <div className="relative">
      <div className="relative inline-block rounded-full overflow-hidden h-9 w-9 md:h-11 md:w-11">
        <Image
          fill
          src={image || "/images/website-images/placeholder.jpg"}
          alt="Avatar"
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default Avatar;
