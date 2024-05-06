"use client";
import InfoSearchClient, {
  InfoPageValue,
} from "@/app/components/client/InfoSearchClient";
import { Outfit } from "next/font/google";
import { useRouter } from "next/navigation";
import { useState } from "react";

const outfit = Outfit({
  display: "swap",
  subsets: ["latin"],
});
const Info = () => {
  const [infoPage, setInfoPage] = useState<InfoPageValue>();
  const router = useRouter();
  const handleChange = (value: InfoPageValue) => {
    console.log(value.href);
    if (value && value.href) {
      router.push(value.href);
    }
  };
  return (
    <div
      className={`${outfit.className} min-h-screen flex justify-center items-center`}
    >
      <InfoSearchClient value={infoPage} onChange={handleChange} />
    </div>
  );
};

export default Info;
