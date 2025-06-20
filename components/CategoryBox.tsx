"use client";
//query based category boxes for use on market page
import qs from "query-string";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { IconType } from "react-icons";
import { OutfitFont } from "./fonts";

interface CategoryBoxProps {
  icon: IconType;
  label: string;
  selected?: boolean;
}

const CategoryBox: React.FC<CategoryBoxProps> = ({
  icon: Icon,
  label,
  selected,
}) => {
  const router = useRouter();
  const params = useSearchParams();

  const handleClick = useCallback(() => {
    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    const updatedQuery = {
      ...currentQuery,
      q: label,
    };

    if (params?.get("q") === label) {
      delete (updatedQuery as { q?: string }).q;
    }

    const url = qs.stringifyUrl(
      {
        url: "/market",
        query: updatedQuery,
      },
      { skipNull: true }
    );

    router.push(url);
  }, [label, router, params]);

  const baseStyles = `flex flex-col items-center justify-center gap-2 p-3 border-b-2 transition cursor-pointer`;

  const selectedStyles = selected
    ? "border-b-neutral-800 dark:border-b-neutral-200"
    : "border-transparent";

  return (
    <div
      onClick={handleClick}
      className={`flex flex-col items-center justify-center gap-2 px-3 hover:text-neutral-800 transition cursor-pointer ${
        selected ? "border-b-neutral-800" : "border-transparent"
      } ${selected ? "text-neutral-800" : "text-neutral-500"}
      `}
    >
      <Icon size={25} />

      <div
        className={`${OutfitFont.className} font-medium text-[8px] sm:text-sm`}
      >
        {label}
      </div>
    </div>
  );
};

export default CategoryBox;
