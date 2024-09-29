"use client";
import { useRouter } from "next/navigation";
import { MdKeyboardArrowRight } from "react-icons/md";

const Tab = ({ label, href }: { label: string; href: string }) => {
  const router = useRouter();
  return (
    <div className="md:w-[75%] lg:w-[50%] xl:w-[40%] 2xl:w-[55%]">
      <div
        onClick={() => {
          router.push(href);
        }}
        className="flex justify-between mx-5 items-center hover:cursor-pointer"
      >
        <li>{label}</li>
        <MdKeyboardArrowRight />
      </div>
      <div className="my-5 border border-b-[1px]"></div>
    </div>
  );
};

export default Tab;
