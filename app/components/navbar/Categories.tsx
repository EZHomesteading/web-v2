"use client";

import {
  GiCoolSpices,
  GiGrainBundle,
  GiWrappedSweet,
  GiPorcelainVase,
  GiJellyBeans,
  GiBread,
  GiTomato,
  GiMilkCarton,
} from "react-icons/gi";
import { LuNut, LuBeef } from "react-icons/lu";
import { CiApple } from "react-icons/ci";
import { FaSeedling } from "react-icons/fa6";

import CategoryBox from "../CategoryBox";
import Container from "../Container";
import Filters from "./filter.client";
import { usePathname } from "next/navigation";

export const categories = [
  {
    label: "Fruits",
    icon: CiApple,
    description: "",
  },
  {
    label: "Vegetables",
    icon: GiTomato,
    description: "",
  },
  {
    label: "Dairy",
    icon: GiMilkCarton,
    description: "",
  },
  {
    label: "Bread",
    icon: GiBread,
    description: "",
  },
  {
    label: "Meats",
    icon: LuBeef,
    description: "",
  },
  {
    label: "Grains",
    icon: GiGrainBundle,
    description: "",
  },
  {
    label: "Herbs",
    icon: GiCoolSpices,
    description: "",
  },
  {
    label: "Nuts",
    icon: LuNut,
    description: "",
  },
  {
    label: "Seeds",
    icon: FaSeedling,
    description: "",
  },
  {
    label: "Sweets",
    icon: GiWrappedSweet,
    description: "",
  },
  {
    label: "Oils",
    icon: GiPorcelainVase,
    description: "",
  },
  {
    label: "Legumes",
    icon: GiJellyBeans,
    description: "",
  },
];
interface Props {
  user?: any;
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
            <div className="flex flex-row items-center justify-between overflow-x-auto overflow-y-auto h-fit relative">
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
