"use client";
import logo from "@/public/images/ezhs-noslogan-barn-light.png";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Logo = () => {
  const router = useRouter();

  return (
    <Image
      onClick={() => router.push("/")}
      className="hidden md:block cursor-pointer"
      src={logo}
      height="200"
      width="200"
      alt="Logo"
      priority
    />
  );
};

// Export the Logo component
export default Logo;
