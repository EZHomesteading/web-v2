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
import { CiApple } from "react-icons/ci";
import { FaSeedling } from "react-icons/fa6";

import CategoryBox from "../CategoryBox";
import Container from "../Container";

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
  // {
  //   label: "Poultry",
  //   icon: GiRoastChicken,
  //   description: "",
  // },
  {
    label: "Meats",
    icon: LuBeef,
    description: "",
  },
  // {
  //   label: "Survival",
  //   icon: GiBoatFishing,
  //   description: "",
  // },
  // {
  //   label: "Seafood",
  //   icon: GiFoodChain,
  //   description: "",
  // },
  {
    label: "Grains",
    icon: GiGrainBundle,
    description: "",
  },
  {
    label: "Herbs and Spices",
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

// Categories component
const Categories = () => {
  // Get the search parameters and current pathname
  const params = useSearchParams();
  const q = params?.get("q");
  const pathname = usePathname();

  // Check if it's the main page
  const isShopPage = pathname === "/shop" && "/";

  // If it's not the main page, return null
  if (!isShopPage) {
    return null;
  }

  // Render the Categories component
  return (
    <Container>
      <div
        className="
          pt-4
          flex 
          flex-row 
          items-center 
          justify-between
          overflow-x-auto
        "
      >
        {/* Map through the categories array and render a CategoryBox for each */}
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
