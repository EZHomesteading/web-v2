"use client";

// Import necessary modules and components
import Image from "next/image";
import { useRouter } from "next/navigation";

// Logo component
const Logo = () => {
  // Get the router object
  const router = useRouter();

  // Render the Logo component
  return (
    <Image
      // Handle click event to navigate to the home page
      onClick={() => router.push("/")}
      // Add cursor pointer style for interactivity
      className="hidden md:block cursor-pointer"
      // Specify the image source
      src="/images/ezhs-noslogan-barn-light.png"
      // Specify the image height
      height="200"
      // Specify the image width
      width="200"
      // Specify the alternative text for accessibility
      alt="Logo"
    />
  );
};

// Export the Logo component
export default Logo;
