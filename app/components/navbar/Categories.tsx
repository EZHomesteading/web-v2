"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { IconType } from "react-icons";
import qs from "query-string";
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
import { FaSeedling, FaAppleAlt } from "react-icons/fa";

import Container from "../Container";
import Filters from "./filter.client";
import { navUser } from "@/next-auth";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  weight: ["200"],
});

// Main categories
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

// Subcategories
export const unprocessedProduce = [
  { label: "Fruits", icon: CiApple },
  { label: "Vegetables", icon: GiTomato },
];

export const homemade = [
  { label: "Baked Goods", icon: GiBread },
  { label: "Preserves", icon: GiJellyBeans },
];

export const durableProducts = [
  { label: "Canned Goods", icon: GiCannedFish },
  { label: "Dry Goods", icon: GiGrainBundle },
];

export const dairyAndMeats = [
  { label: "Dairy", icon: GiMilkCarton },
  { label: "Meats", icon: LuBeef },
];

type CategoryKey =
  | "Unprocessed Produce"
  | "Homemade"
  | "Durable Products"
  | "Dairy & Meats";

const subcategories: Record<CategoryKey, { label: string; icon: IconType }[]> =
  {
    "Unprocessed Produce": unprocessedProduce,
    Homemade: homemade,
    "Durable Products": durableProducts,
    "Dairy & Meats": dairyAndMeats,
  };

interface CategoryBoxProps {
  icon: IconType;
  label: string;
  selected?: boolean;
  onClick: () => void;
}

const CategoryBox: React.FC<CategoryBoxProps> = ({
  icon: Icon,
  label,
  selected,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-2 px-3 hover:text-neutral-800 transition cursor-pointer ${
        selected ? "border-b-neutral-800" : "border-transparent"
      } ${selected ? "text-neutral-800" : "text-neutral-500"}
      `}
    >
      <Icon size={25} />
      <div className={`${outfit.className} font-medium text-[8px] sm:text-sm`}>
        {label}
      </div>
    </div>
  );
};

interface Props {
  user?: navUser;
}

const Categories = ({ user }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [category, setCategory] = useState<string | null>(null);
  const [subcategory, setSubcategory] = useState<string | null>(null);
  const [showSubcategories, setShowSubcategories] = useState(false);

  useEffect(() => {
    const cat = searchParams?.get("cat") ?? null;
    const subcat = searchParams?.get("subcat") ?? null;
    setCategory(cat);
    setSubcategory(subcat);
    setShowSubcategories(!!cat && !subcat);
  }, [searchParams]);

  const handleCategoryClick = useCallback(
    (clickedCategory: string) => {
      if (!showSubcategories) {
        // Clicking a main category
        setCategory(clickedCategory);
        setSubcategory(null);
        setShowSubcategories(true);
        router.push(`/market?cat=${encodeURIComponent(clickedCategory)}`, {
          scroll: false,
        });
      } else {
        // Clicking a subcategory
        setSubcategory(clickedCategory);
        router.push(
          `/market?cat=${encodeURIComponent(
            category!
          )}&subcat=${encodeURIComponent(clickedCategory)}`,
          { scroll: false }
        );
      }
    },
    [router, showSubcategories, category]
  );

  const handleBackToMain = useCallback(() => {
    setCategory(null);
    setSubcategory(null);
    setShowSubcategories(false);
    router.push("/market", { scroll: false });
  }, [router]);

  const renderCategories = () => {
    if (!showSubcategories) {
      return categories.map((item) => (
        <CategoryBox
          key={item.label}
          label={item.label}
          icon={item.icon}
          onClick={() => handleCategoryClick(item.label)}
          selected={item.label === category}
        />
      ));
    } else if (category) {
      return (
        subcategories[category as CategoryKey]?.map((item) => (
          <CategoryBox
            key={item.label}
            label={item.label}
            icon={item.icon}
            onClick={() => handleCategoryClick(item.label)}
            selected={subcategory === item.label}
          />
        )) || null
      );
    }
    return null;
  };

  const marketPathName = "/market";
  const isMarket = pathname === marketPathName;

  const fadeVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <Container>
      {isMarket ? (
        <div className="flex flex-row items-center justify-center">
          <div>
            <Filters user={user} />
          </div>
          <div className="w-full p-0 sm:pt-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={showSubcategories ? "sub" : "main"}
                variants={fadeVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ duration: 0.3 }}
                className="flex flex-row items-center justify-evenly overflow-x-auto overflow-y-auto h-fit relative"
              >
                {renderCategories()}
              </motion.div>
            </AnimatePresence>
            {/* {showSubcategories && (
              <button
                onClick={handleBackToMain}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Back to Main Categories
              </button>
            )} */}
          </div>
        </div>
      ) : null}
    </Container>
  );
};

export default Categories;
