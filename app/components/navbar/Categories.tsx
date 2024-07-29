"use client";
//display categories navbar component
import {
  GiCoolSpices,
  GiGrainBundle,
  GiWrappedSweet,
  GiPorcelainVase,
  GiJellyBeans,
  GiBread,
  GiTomato,
  GiMilkCarton,
  GiCakeSlice,
  GiCannedFish,
} from "react-icons/gi";
import { LuNut, LuBeef } from "react-icons/lu";
import { CiApple } from "react-icons/ci";
import { FaSeedling } from "react-icons/fa6";

import CategoryBox from "../CategoryBox";
import Container from "../Container";
import Filters from "./filter.client";
import { usePathname } from "next/navigation";
import { navUser } from "@/next-auth";
import { FaAppleAlt } from "react-icons/fa";

export const categories = [
  {
    label: "Unprocessed Produce",
    icon: FaAppleAlt,
  },
  {
    label: "Homemade",
    icon: GiCakeSlice,
  },
  {
    label: "Durable Products",
    icon: GiCannedFish,
  },
  {
    label: "Dairy & Meats",
    icon: GiMilkCarton,
  },


];
interface Props {
  user?: navUser;
}

const Categories = ({ user }: Props) => {
  const pathname = usePathname();
  const marketPathName = "/market";
  let isMarket = false;
  if (pathname === marketPathName) {
    isMarket = true;
  }
  return (
    <Container>
      {isMarket ? (
        <div className="flex flex-row items-center">
          <div>
            <Filters user={user} />
          </div>
          <div className="w-full p-0 sm:pt-4">
            <div className="flex flex-row items-center justify-evenly overflow-x-auto overflow-y-auto h-fit relative">
              {categories.map((item) => (
                <CategoryBox
                  key={item.label}
                  label={item.label}
                  icon={item.icon}
                />
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </Container>
  );
};

export default Categories;
