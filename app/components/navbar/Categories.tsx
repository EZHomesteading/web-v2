"use client";

// Import necessary modules and icons
import { usePathname, useSearchParams } from "next/navigation";
import {
  GiBoatFishing,
  GiRoastChicken,
  GiFoodChain,
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

// Define an array of category objects
export const categories = [
  {
    label: "Fruits",
    icon: CiApple,
    description: "This property is close to the beach!",
  },
  {
    label: "Vegetables",
    icon: GiTomato,
    description: "This property has windmills!",
  },
  {
    label: "Dairy",
    icon: GiMilkCarton,
    description: "This property is modern!",
  },
  {
    label: "Bread",
    icon: GiBread,
    description: "This property is in the countryside!",
  },
  {
    label: "Poultry",
    icon: GiRoastChicken,
    description: "This property has a beautiful pool!",
  },
  {
    label: "Beef",
    icon: LuBeef,
    description: "This property is on an island!",
  },
  {
    label: "Survival",
    icon: GiBoatFishing,
    description: "This property is near a lake!",
  },
  {
    label: "Seafood",
    icon: GiFoodChain,
    description: "This property has skiing activities!",
  },
  {
    label: "Grains",
    icon: GiGrainBundle,
    description: "This property is an ancient castle!",
  },
  {
    label: "Spices",
    icon: GiCoolSpices,
    description: "This property is in a spooky cave!",
  },
  {
    label: "Nuts",
    icon: LuNut,
    description: "This property offers camping activities!",
  },
  {
    label: "Seeds",
    icon: FaSeedling,
    description: "This property is in an arctic environment!",
  },
  {
    label: "Sweets",
    icon: GiWrappedSweet,
    description: "This property is in the desert!",
  },
  {
    label: "Oils",
    icon: GiPorcelainVase,
    description: "This property is in a barn!",
  },
  {
    label: "Legumes",
    icon: GiJellyBeans,
    description: "This property is brand new and luxurious!",
  },
];

// Categories component
const Categories = () => {
  // Get the search parameters and current pathname
  const params = useSearchParams();
  const category = params?.get("category");
  const pathname = usePathname();

  // Check if it's the main page
  const isMainPage = pathname === "/";

  // If it's not the main page, return null
  if (!isMainPage) {
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
            selected={category === item.label}
          />
        ))}
      </div>
    </Container>
  );
};

// Export the Categories component
export default Categories;
