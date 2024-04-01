"use client";
import { useRouter } from "next/navigation";
import { Outfit } from "next/font/google";
import { useTheme } from "next-themes";

const outfit = Outfit({
  weight: ["100"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

const Logo = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const textColor = theme === "dark" ? "text-white" : "text-black";
  return (
    <div
      onClick={() => router.push("/")}
      className={`hover:cursor-pointer text-md md:text-2xl font-bold tracking-tight mb-2 ${textColor}`}
    >
      <h1 className={outfit.className}>EZ Homesteading</h1>
    </div>
  );
};

// Export the Logo component
export default Logo;
