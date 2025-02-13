"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { IconType } from "react-icons";
import qs from "query-string";
import {
  GiGrainBundle,
  GiBread,
  GiTomato,
  GiMilkCarton,
  GiCakeSlice,
  GiCannedFish,
  GiButter,
  GiPeanut,
  GiHerbsBundle,
  GiClothes,
  GiHorseshoe,
  GiRaspberry,
  GiStrawberry,
  GiChicken,
} from "react-icons/gi";
import { LuBeef, LuBean, LuMilk } from "react-icons/lu";
import { CiApple, CiForkAndKnife } from "react-icons/ci";
import { FaAppleAlt } from "react-icons/fa";

import { TbCheese, TbEggs, TbMeat, TbPig } from "react-icons/tb";
import { IoFishOutline } from "react-icons/io5";
import { MdOutlineSolarPower } from "react-icons/md";
import { UserRole } from "@prisma/client";
import Container from "@/components/Container";
import Filters from "./filter.client";
import { OutfitFont } from "@/components/fonts";

export const categories = [
  {
    label: "Produce",
    icon: FaAppleAlt,
    url: "unprocessed-produce",
  },
  {
    label: "Homemade",
    icon: GiCakeSlice,
    url: "homemade",
  },
  {
    label: "Durables",
    icon: GiCannedFish,
    url: "durable-products",
  },
  {
    label: "Deli",
    icon: GiMilkCarton,
    url: "dairy-meat",
  },
];

export const unprocessedProduce = [
  { label: "Fruits", icon: CiApple, url: "fruit" },
  { label: "Vegetables", icon: GiTomato, url: "vegetables" },
  { label: "Nuts", icon: GiPeanut, url: "nuts" },
  { label: "Herbs", icon: GiHerbsBundle, url: "herbs" },
  { label: "Legumes", icon: LuBean, url: "legumes" },
];

export const homemade = [
  { label: "Baked Goods", icon: GiCakeSlice, url: "baked-goods" },
  { label: "Crafts", icon: GiClothes, url: "crafts" },
  { label: "Jams", icon: GiRaspberry, url: "jams" },
  { label: "Preserves", icon: GiStrawberry, url: "preserves" },
  { label: "Breads", icon: GiBread, url: "breads" },
];

export const durableProducts = [
  { label: "Canned Goods", icon: GiCannedFish, url: "canned-goods" },
  { label: "Dry Goods", icon: GiGrainBundle, url: "dry-goods" },
  { label: "Survival", icon: MdOutlineSolarPower, url: "survival" },
  { label: "Tools", icon: GiHorseshoe, url: "tools" },
  { label: "Kitchen Ware", icon: CiForkAndKnife, url: "kitchen-wares" },
];

export const dairyAndMeats = [
  { label: "Milk", icon: LuMilk, url: "milks" },
  { label: "Eggs", icon: TbEggs, url: "eggs" },
  { label: "Poultry", icon: GiChicken, url: "poultry" },
  { label: "Beef", icon: LuBeef, url: "beef" },
  { label: "Pork", icon: TbPig, url: "pork" },
  { label: "Exotic Meat", icon: TbMeat, url: "alternative-meats" },
  { label: "Seafood", icon: IoFishOutline, url: "seafood" },
  { label: "Butter", icon: GiButter, url: "butter" },
  { label: "Cheese", icon: TbCheese, url: "cheese" },
];

type CategoryKey = "Produce" | "Homemade" | "Durables" | "Deli";

type SubcategoryItem = { label: string; icon: IconType; url: string };

const subcategories: Record<CategoryKey, SubcategoryItem[]> = {
  Produce: unprocessedProduce,
  Homemade: homemade,
  Durables: durableProducts,
  Deli: dairyAndMeats,
};

interface CategoryBoxProps {
  icon: IconType;
  label: string;
  url: string;
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
      className={`flex flex-col items-center justify-center gap-2 px-3 pt-2 hover:text-neutral-800 transition cursor-pointer flex-shrink-0 ${
        selected ? "border-b-neutral-800" : "border-transparent"
      } ${selected ? "text-neutral-800" : "text-neutral-500"}`}
    >
      <Icon size={25} />
      <div
        className={`${OutfitFont.className} font-light text-xs whitespace-nowrap text-center`}
      >
        {label}
      </div>
    </div>
  );
};

interface Props {
  role?: UserRole;
}

const Categories = ({ role }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [category, setCategory] = useState<string | null>(null);
  const [subcategory, setSubcategory] = useState<string | null>(null);
  const [showSubcategories, setShowSubcategories] = useState(false);

  useEffect(() => {
    const cat = searchParams?.get("category") ?? null;
    const subcat = searchParams?.get("subcategory") ?? null;
    setCategory(cat);
    setSubcategory(subcat);
    setShowSubcategories(!!cat && !subcat);
  }, [searchParams]);

  const handleCategoryClick = useCallback(
    (clickedUrl: string) => {
      const clickedCategory = categories.find((cat) => cat.url === clickedUrl);
      const currentParams = searchParams
        ? qs.parse(searchParams.toString())
        : {};
      delete currentParams.q;
      if (clickedCategory) {
        const updatedParams = {
          ...currentParams,
          category: clickedUrl,
          subcategory: undefined,
        };
        setCategory(clickedUrl);
        setSubcategory(null);
        setShowSubcategories(true);
        router.push(`/market?${qs.stringify(updatedParams)}`, {
          scroll: false,
        });
      } else {
        const updatedParams = {
          ...currentParams,
          category: category,
          subcategory: clickedUrl,
        };
        setSubcategory(clickedUrl);
        router.push(`/market?${qs.stringify(updatedParams)}`, {
          scroll: false,
        });
      }
    },
    [router, category, searchParams]
  );

  const renderCategories = () => {
    const mainCategories = (
      <motion.div
        key="main"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-row items-center justify-evenly w-full overflow-x-auto"
      >
        {categories.map((item) => (
          <CategoryBox
            key={item.label}
            label={item.label}
            icon={item.icon}
            url={item.url}
            onClick={() => handleCategoryClick(item.url)}
            selected={item.url === category}
          />
        ))}
      </motion.div>
    );

    let subcategoryElements = null;
    if (category && showSubcategories) {
      const currentSubcategories =
        subcategories[
          categories.find((cat) => cat.url === category)?.label as CategoryKey
        ];
      subcategoryElements = (
        <motion.div
          key="sub"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-row items-center justify-evenly w-full"
        >
          {currentSubcategories?.map((item) => (
            <CategoryBox
              key={item.label}
              label={item.label}
              icon={item.icon}
              url={item.url}
              onClick={() => handleCategoryClick(item.url)}
              selected={item.url === subcategory}
            />
          ))}
        </motion.div>
      );
    }

    return { mainCategories, subcategoryElements };
  };

  return (
    <Container>
      <div
        className={`${OutfitFont.className} flex items-center justify-center `}
      >
        <Filters role={role} />
        <div className="w-full overflow-x-auto">
          <AnimatePresence mode="wait">
            {showSubcategories
              ? renderCategories().subcategoryElements
              : renderCategories().mainCategories}
          </AnimatePresence>
        </div>
      </div>
    </Container>
  );
};

export default Categories;
