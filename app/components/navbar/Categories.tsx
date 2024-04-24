"use client";

import { usePathname, useSearchParams } from "next/navigation";
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
import { CiApple, CiFilter } from "react-icons/ci";
import { FaSeedling } from "react-icons/fa6";

import CategoryBox from "../CategoryBox";
import Container from "../Container";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import Filters from "./filter";
import { UserInfo } from "@/next-auth";

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
  user?: UserInfo;
}

const Categories = ({ user }: Props) => {
  const params = useSearchParams();
  const q = params?.get("q");
  const pathname = usePathname();

  const isShopPage = pathname === "/shop" && "/";

  if (!isShopPage) {
    return null;
  }

  return (
    <Container>
      <Filters user={user} />
      <div
        className="
          p-0
          sm:pt-4
          flex 
          flex-row 
          items-center 
          justify-between
          overflow-x-auto
          overflow-y-auto
          h-fit
          relative    "
      >
        {categories.map((item) => (
          <CategoryBox
            key={item.label}
            label={item.label}
            icon={item.icon}
            selected={q === item.label}
          />
        ))}
      </div>
    </Container>
  );
};

// Export the Categories component
export default Categories;
