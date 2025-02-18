import { useState } from "react";
import {
  GiAppleCore,
  GiCandyCanes,
  GiJellyBeans,
  GiOlive,
  GiWheat,
} from "react-icons/gi";
import {
  GiCarrot,
  GiCoconuts,
  GiHerbsBundle,
  GiWoodCabin,
  GiCupcake,
  GiHoneypot,
  GiSlicedBread,
  GiWaterBottle,
  GiCampfire,
  GiCookingPot,
  GiMilkCarton,
  GiLeg,
  GiChickenOven,
  GiCow,
  GiPig,
  GiFishCorpse,
  GiButterToast,
} from "react-icons/gi";
import { FaTools } from "react-icons/fa";
import { IoFastFoodOutline } from "react-icons/io5";
import { Textarea } from "@/components/ui/textarea";
import Toast from "@/components/ui/toast";

type Category =
  | "unprocessed-produce"
  | "homemade"
  | "durables"
  | "dairy-meat"
  | "";

function isValidCategory(category: string): category is Exclude<Category, ""> {
  return category !== "" && category in SubCategories;
}

const SubCategoryIcons: Record<string, React.ReactNode> = {
  fruit: <GiAppleCore size={30} />,
  vegetables: <GiCarrot size={30} />,
  nuts: <GiCoconuts size={30} />,
  herbs: <GiHerbsBundle size={30} />,
  grains: <GiWheat size={30} />,
  legumes: <GiJellyBeans size={30} />,
  crafts: <GiWoodCabin size={30} />,
  "baked-goods": <GiCupcake size={30} />,
  jams: <GiHoneypot size={30} />,
  breads: <GiSlicedBread size={30} />,
  pasta: <GiCookingPot size={30} />,
  oils: <GiOlive size={30} />,
  candy: <GiCandyCanes size={30} />,
  "canned-goods": <GiWaterBottle size={30} />,
  tools: <FaTools size={30} />,
  survival: <GiCampfire size={30} />,
  "kitchen-wares": <GiCookingPot size={30} />,
  milks: <GiMilkCarton size={30} />,
  eggs: <GiLeg size={30} />,
  poultry: <GiChickenOven size={30} />,
  beef: <GiCow size={30} />,
  pork: <GiPig size={30} />,
  "alternative-meats": <IoFastFoodOutline size={30} />,
  seafood: <GiFishCorpse size={30} />,
  "dairy-products": <GiButterToast size={30} />,
};

const SubCategories: Record<Exclude<Category, "">, string[]> = {
  "unprocessed-produce": [
    "fruit",
    "vegetables",
    "nuts",
    "herbs",
    "grains",
    "legumes",
  ],
  homemade: [
    "crafts",
    "baked-goods",
    "jams",
    "breads",
    "pasta",
    "oils",
    "candy",
  ],
  durables: ["canned-goods", "tools", "survival", "kitchen-wares"],
  "dairy-meat": [
    "milks",
    "eggs",
    "poultry",
    "beef",
    "pork",
    "alternative",
    "seafood",
    "dairy-products",
  ],
};

const CapitalizeWords = (str: string) => {
  return str
    .split("-")
    .map((word) =>
      word
        .split(" ")
        .map((subWord) => subWord.charAt(0).toUpperCase() + subWord.slice(1))
        .join(" ")
    )
    .join(" ");
};
// - - - - - - - - STEP 3 (DETAILS) - - - - - - - - - -
const TitleCase = (str: string): string => {
  const exceptions = [
    "a",
    "and",
    "as",
    "at",
    "but",
    "by",
    "down",
    "for",
    "from",
    "if",
    "in",
    "into",
    "like",
    "near",
    "nor",
    "of",
    "off",
    "on",
    "once",
    "onto",
    "or",
    "over",
    "past",
    "so",
    "than",
    "that",
    "to",
    "upon",
    "when",
    "with",
    "yet",
    "the",
  ];

  return str
    .toLowerCase()
    .split(" ")
    .map((word, index) => {
      if (index === 0 || !exceptions.includes(word)) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word;
    })
    .join(" ");
};
function FilterAndAppendWords(inputString: string) {
  // List of common words to filter out
  const commonWords = new Set([
    "a",
    "an",
    "and",
    "are",
    "as",
    "at",
    "be",
    "by",
    "for",
    "from",
    "has",
    "he",
    "in",
    "is",
    "it",
    "its",
    "of",
    "on",
    "that",
    "the",
    "to",
    "was",
    "were",
    "will",
    "with",
    "this",
    "these",
    "those",
    "they",
    "my",
    "i",
    "have",
    "then",
    "there",
    "desc",
    "description",
    "product",
    "ass",
    "bitch",
    "cunt",
    "whore",
    "fuck",
    "fuckin",
    "fucking",
    " ",
  ]);
  const words = inputString.toLowerCase().match(/\b\w+\b/g) || [];

  const result = words.filter((word) => !commonWords.has(word));

  return result;
}

const KeywordInput = ({
  keywords,
  onAddKeyword,
  onRemoveKeyword,
}: {
  keywords: string[];
  onAddKeyword: (keyword: string) => void;
  onRemoveKeyword: (index: number) => void;
}) => {
  const [keyword, setKeyword] = useState("");

  const handleAddTag = () => {
    if (keywords.length >= 10) {
      Toast({ message: "Maximum number keyword tags reached" });
      return;
    }
    if (keyword.trim()) {
      onAddKeyword(keyword);
      setKeyword("");
    }
  };

  const handleKeyDown = (e: { key: string; preventDefault: () => void }) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
    if (
      !/^[a-z]$/.test(e.key.toLowerCase()) &&
      e.key !== "Backspace" &&
      e.key !== "Delete"
    ) {
      e.preventDefault();
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          className="flex pb-6 min-h-[62px] text-base w-full rounded-sm border border-input bg-transparent px-3 py-2 shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          id="keywords"
          placeholder={`Type a keyword and press Enter or Add Tag`}
          onKeyDown={handleKeyDown}
          maxLength={64}
          onChange={(e) => {
            const lowercaseAlphabeticValue = e.target.value
              .toLowerCase()
              .replace(/[^a-z]/g, "");
            setKeyword(lowercaseAlphabeticValue);
          }}
          value={keyword}
        />
        <button
          onClick={handleAddTag}
          className="absolute right-1 bottom-1 px-4 py-1 bg-black text-white hover:bg-gray-800 transition-colors text-sm font-medium rounded-sm"
        >
          Add Tag
        </button>
      </div>

      <div className="flex flex-wrap gap-2 min-h-12">
        {keywords.map((kw: string, index: number) => (
          <span
            key={index}
            onClick={() => onRemoveKeyword(index)}
            className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200 cursor-pointer transition-colors flex items-center group h-fit"
          >
            {kw}
            <span className="ml-1 text-gray-400 group-hover:text-gray-600">
              ×
            </span>
          </span>
        ))}
      </div>

      <p className="text-xs text-gray-500 italic">
        Keywords help buyers find your products. Enter one word at a time -
        letters only.
      </p>
    </div>
  );
};

export {
  isValidCategory,
  SubCategories,
  SubCategoryIcons,
  CapitalizeWords,
  KeywordInput,
  FilterAndAppendWords,
  TitleCase,
};
