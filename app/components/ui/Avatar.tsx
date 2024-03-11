"use client";

// Import necessary dependencies and interfaces
import Image from "next/image";

interface AvatarProps {
  src: string | null | undefined;
}

// Avatar component
const Avatar: React.FC<AvatarProps> = ({ src }) => {
  return (
    // Render the Image component with rounded corners
    <Image
      className="rounded-full"
      height="30"
      width="30"
      alt="Avatar"
      src={src || "/images/placeholder.jpg"} // Use provided source or fallback placeholder image
    />
  );
};

export default Avatar;
