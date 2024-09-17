import { UserInfo } from "@/next-auth";
import { Outfit } from "next/font/google";
import Link from "next/link";
import { GiFruitTree } from "react-icons/gi";
import { IoStorefrontOutline } from "react-icons/io5";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});
interface p {
  user: UserInfo;
}

const StepTen = ({ user }: p) => {
  return (
    <div className={`${outfit.className} h-screen w-screen text-black  `}>
      <div className="text-center pt-[2%] sm:pt-[5%] text-4xl">
        Select a Role
      </div>
      <div className="h-full flex flex-col items-center sm:pt-[10%] pt-[30%] px-10">
        <ul className="w-full max-w-3xl">
          {[
            {
              text: ["Become a co-op & sell to anyone"],
              icon: IoStorefrontOutline,
              subtext: [
                "People who already have farmer's market stands &",
                "are looking to expand their cataloug generally choose to be a Co-op.",
                "A co-op is a greater time commitment but the rewards are better as well.",
              ],
            },
            {
              text: ["Become a grower & sell only to co-ops"],
              icon: GiFruitTree,
              subtext: [
                "People who prefer to sell in larger quantities &",
                "do not want to interact with buyers choose to be an EZH grower.",
                "Less time commitment with less rewards.",
              ],
            },
          ].map((item, index) => (
            <li
              key={index}
              className={`w-full hover:cursor-pointer ${
                index === 1
                  ? "border-t-[1px] border-b-[1px] my-10 py-10 border-black "
                  : ""
              }`}
            >
              <div className="flex items-center justify-between w-full hover:text-neutral-600 hover:italic">
                <div className="flex flex-col">
                  <div className="text-lg sm:text-2xl font-light">
                    {Array.isArray(item.text)
                      ? item.text.map((line, i) => <div key={i}>{line}</div>)
                      : item.text}
                  </div>

                  <div className="sm:text-xs text-[.6rem] w-[75%] font-light text-neutral-400">
                    {Array.isArray(item.subtext)
                      ? item.subtext.map((line, i) => <div key={i}>{line}</div>)
                      : item.subtext}
                  </div>
                </div>
                <item.icon className="text-4xl sm:text-7xl" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StepTen;
