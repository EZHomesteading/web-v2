import React from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { GiShinyApple, GiMeat } from "react-icons/gi";
import { TbCandle } from "react-icons/tb";
import { LuShovel } from "react-icons/lu";

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
  <Card className="h-[120px] w-[180px]" onClick={onClick}>
    <CardContent className="rounded-lg h-full py-2 flex flex-col justify-evenly">
      {icon}
      <div className="text-xs">{title}</div>
      <div className="text-[8px]">{description}</div>
    </CardContent>
  </Card>
);

const SubCategoryCard: React.FC<SubCategoryCardProps> = ({
  title,
  isSelected,
  onClick,
}) => (
  <Card
    className={`h-[60px] w-[140px] ${
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
  <div className="grid grid-cols-4 sm:grid-cols-2 gap-3">
    <CategoryCard
      icon={<GiShinyApple size={40} />}
      title="Unprocessed Produce"
      description="Ex: Apples & Tomatoes"
      onClick={() => setCategory("unprocessed-produce")}
    />
    <CategoryCard
      icon={<TbCandle size={40} />}
      title="Homemade"
      description="Ex: Apple Pie & Beeswax Candles"
      onClick={() => setCategory("homemade")}
    />
    <CategoryCard
      icon={<LuShovel size={40} />}
      title="Durables"
      description="Ex: Canned Food & Solar Panels"
      onClick={() => setCategory("durables")}
    />
    <CategoryCard
      icon={<GiMeat size={40} />}
      title="Dairy & Meat"
      description="Ex: Milk Shares & Chicken"
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
    <div className="flex flex-col gap-4 h-[calc(100vh-86.4px)] md:h-full fade-in">
      <h1>Select a Category</h1>
      <h2>Which best describes your product?</h2>
      <div className="flex justify-center items-center">
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
