import React from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { GiShinyApple, GiMeat, GiRopeCoil } from "react-icons/gi";
import { TbCandle } from "react-icons/tb";
import { LuBeef, LuShovel } from "react-icons/lu";
import { CiApple, CiHome } from "react-icons/ci";
import { LiaCheeseSolid } from "react-icons/lia";

export type Category =
  | "unprocessed-produce"
  | "homemade"
  | "durables"
  | "dairy-meat"
  | "";
type SubCategory = string;

interface CategoryCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

interface SubCategoryCardProps {
  title: string;
  isSelected: boolean;
  onClick: () => void;
}

interface CategorySelectionProps {
  category: Category;
  setCategory: (category: Category) => void;
}

interface SubCategorySelectionProps {
  category: Category;
  subCategory: SubCategory;
  setSubCategory: (subCategory: SubCategory) => void;
  onGoBack: () => void;
}

const subCategories: Record<Exclude<Category, "">, string[]> = {
  "unprocessed-produce": ["fruit", "vegetables", "nuts", "herbs", "legumes"],
  homemade: ["crafts", "baked-goods", "jams", "pastries", "breads"],
  durables: ["canned-goods", "tools", "survival", "kitchen-wares"],
  "dairy-meat": [
    "milks",
    "eggs",
    "poultry",
    "beef",
    "pork",
    "alternative-meats",
    "seafood",
    "butter",
    "cheese",
  ],
};

function isValidCategory(
  category: Category
): category is Exclude<Category, ""> {
  return category !== "" && category in subCategories;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  icon,
  title,
  description,
  onClick,
}) => (
  <Card className="w-full h-full" onClick={onClick}>
    <CardContent className="rounded-lg h-full py-4 flex flex-row items-center justify-between space-x-4">
      <div className="flex flex-col">
        <div className="text-lg font-light">{title}</div>
        <div className="text-sm text-gray-600 font-extralight">
          {description}
        </div>
      </div>
      <div className="flex-shrink-0">{icon}</div>
    </CardContent>
  </Card>
);

const SubCategoryCard: React.FC<SubCategoryCardProps> = ({
  title,
  isSelected,
  onClick,
}) => (
  <Card
    className={`w-[150px] aspect-video ${
      isSelected ? "text-emerald-700 border-emerald-300 shadow-xl" : ""
    }`}
    onClick={onClick}
  >
    <CardContent className="rounded-lg h-full py-2 flex flex-col justify-evenly">
      <div className="flex justify-center">{title}</div>
    </CardContent>
  </Card>
);

const GoBackButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button className="h-[30px] w-[100px] mb-3" onClick={onClick}>
    <CardContent className="bg-red-600 rounded-lg h-full py-2 flex flex-col justify-evenly">
      <div className="text-xs">go back</div>
    </CardContent>
  </button>
);

const CategorySelection: React.FC<CategorySelectionProps> = ({
  category,
  setCategory,
}) => (
  <div className="flex flex-col space-y-4 w-full md:w-[40%] max-w-[600px] min-w-[280px]">
    <CategoryCard
      icon={<CiApple size={40} />}
      title="Unprocessed Produce"
      description="Apples, Peaches & Tomatoes"
      onClick={() => setCategory("unprocessed-produce")}
    />
    <CategoryCard
      icon={<CiHome size={40} />}
      title="Homemade"
      description="Apple Pie & Beeswax Candles"
      onClick={() => setCategory("homemade")}
    />
    <CategoryCard
      icon={<GiRopeCoil size={40} />}
      title="Durables"
      description="Canned Food & Solar Panels"
      onClick={() => setCategory("durables")}
    />
    <CategoryCard
      icon={<LuBeef size={40} />}
      title="Dairy & Meat"
      description="Milk Shares & Free-Range Chicken"
      onClick={() => setCategory("dairy-meat")}
    />
  </div>
);

const SubCategorySelection: React.FC<SubCategorySelectionProps> = ({
  category,
  subCategory,
  setSubCategory,
  onGoBack,
}) => {
  if (!isValidCategory(category)) {
    return null;
  }

  return (
    <div>
      <GoBackButton onClick={onGoBack} />
      <div className="grid grid-cols-4 sm:grid-cols-3 gap-3">
        {subCategories[category].map((sub) => (
          <SubCategoryCard
            key={sub}
            title={sub.replace("-", " ")}
            isSelected={subCategory === sub}
            onClick={() => setSubCategory(sub)}
          />
        ))}
      </div>
    </div>
  );
};

interface ProductCategorySelectionProps {
  step: number;
  category: Category;
  setCategory: (category: Category) => void;
  subCategory: SubCategory;
  setSubCategory: (subCategory: SubCategory) => void;
}

const ProductCategorySelection: React.FC<ProductCategorySelectionProps> = ({
  step,
  category,
  setCategory,
  subCategory,
  setSubCategory,
}) => {
  if (step !== 1) return null;

  return (
    <div className="w-full flex flex-col mt-[18%]">
      <h1 className="font-normal text-[28px] mb-[5%]">
        Select a Category for your Product
      </h1>
      <div className="flex justify-center items-center w-full">
        {category === "" ? (
          <CategorySelection category={category} setCategory={setCategory} />
        ) : (
          <SubCategorySelection
            category={category}
            subCategory={subCategory}
            setSubCategory={setSubCategory}
            onGoBack={() => {
              setCategory("");
              setSubCategory("");
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ProductCategorySelection;
