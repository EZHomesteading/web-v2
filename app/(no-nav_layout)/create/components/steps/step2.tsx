import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import SearchClient from "@/components/client/SearchClient";
import { FormattedProduct } from "@/hooks/use-product";
import useProducts from "@/hooks/use-product";
import { FieldValues, UseFormSetValue } from "react-hook-form";

interface StepTwoProps {
  setValue: UseFormSetValue<FieldValues>;
  title: string;
  setTitle: (value: string) => void;
  setReview: (value: boolean) => void;
  setImageSrc: (imageSrc: string[]) => void;
  description: string;
  setDescription: (value: string) => void;
  tag: string;
  setTag: (value: string) => void;
  tags: string[];
  setTags: (value: string[]) => void;
  buildKeyWords: (desc: string) => void;
  isLoading: boolean;
  subcat: string;
  onCustomTitleSet: () => void;
}

const StepTwo: React.FC<StepTwoProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  tag,
  setTag,
  tags,
  setTags,
  buildKeyWords,
  isLoading,
  subcat,
  setImageSrc,
  setReview,
  onCustomTitleSet,
  setValue,
}) => {
  const [product, setProduct] = useState<FormattedProduct | null>(null);
  const [checkbox1Checked, setCheckbox1Checked] = useState(false);
  const [subcategory, setSubcategory] = useState(subcat);
  const { getAll, searchProducts } = useProducts();
  const titleCase = (str: string): string => {
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
  const handleCustomAction = (value: string) => {
    const titleCasedValue = titleCase(value);
    setTitle(titleCasedValue);
    setValue("title", titleCasedValue);
    handleCheckboxChange(true);
    onCustomTitleSet();
  };
  const handleCheckboxChange = (checked: boolean) => {
    setCheckbox1Checked(checked);

    if (checked) {
      setSubcategory("custom");
      setReview(true);
    } else {
      setSubcategory(subcat);
      setReview(false);
    }
  };

  const handleProductChange = (value: FormattedProduct | null) => {
    setProduct(value);
    if (value) {
      setTitle(value.label);
      setImageSrc(value.photo ? [value.photo] : []);
      setValue("title", value.label);
    } else {
      setValue("title", "");
      setTitle("");
      setImageSrc([]);
    }
  };

  useEffect(() => {
    if (subcategory === "custom") {
      setProduct(null);
    }
  }, [subcategory, title]);

  return (
    <div className="flex justify-center items-start min-h-screen w-full ">
      <div className="flex flex-col gap-5 fade-in  w-full max-w-[500px] px-4">
        <div className="relative">
          {subcategory === "custom" ? (
            <div>
              <input
                className="flex min-h-[62px] w-full text-[16px] rounded-md border border-input bg-transparent px-3 py-2 shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                id="title"
                placeholder={title ? title : "Enter Product Title"}
                disabled={isLoading}
                maxLength={64}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                value={title}
              />
              <div className="flex flex-col gap-y-2">
                <div className="flex flex-row gap-x-2 pt-4 items-center">
                  <Checkbox
                    checked={checkbox1Checked}
                    onCheckedChange={(checked: boolean) =>
                      handleCheckboxChange(checked)
                    }
                  />
                  <Label className="font-light">
                    Use a Custom Title
                    <div className="text-xs text-neutral-600 font-light">
                      Your title will be reviewed by EZH before the listing is
                      visible to buyers
                    </div>
                  </Label>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <SearchClient
                title={title}
                subcat={subcat}
                value={product}
                onCustomAction={handleCustomAction}
                customActionLabel="Create a Custom Title"
                onChange={handleProductChange}
                searchProducts={searchProducts}
                getAll={getAll}
                onCustomTitleSet={onCustomTitleSet}
              />
            </div>
          )}
        </div>

        <hr />
        <Textarea
          id="description"
          placeholder="Description"
          disabled={isLoading}
          className="h-[30vh] shadow-sm text-[16px]"
          maxLength={500}
          onChange={(e) => {
            setDescription(e.target.value);
            buildKeyWords(e.target.value);
          }}
          value={description}
        />
        <hr />
        <div className="w-full">
          <div className="mb-1 ml-[2px] text-sm">
            Tags are used to help users search for your products.
          </div>
          <div className="mb-1 ml-[2px] mt-1 text-sm">
            Tags must be entered one word at a time and will not be visible to
            users. Enter ONE Tag and select “Add Tag” each time.
          </div>
          <Textarea
            id="keywords"
            placeholder="Enter keywords to make your product easier to find"
            disabled={isLoading}
            maxLength={64}
            onChange={(e) => {
              const lowercaseAlphabeticValue = e.target.value
                .toLowerCase()
                .replace(/[^a-z]/g, "");
              setTag(lowercaseAlphabeticValue);
            }}
            onKeyDown={(e) => {
              if (
                !/^[a-z]$/.test(e.key.toLowerCase()) &&
                e.key !== "Backspace" &&
                e.key !== "Delete"
              ) {
                e.preventDefault();
              }
            }}
            value={tag}
            className="text-[16px]"
          />
          <div className="mb-4 ml-[2px] mt-1 text-sm">
            Click a tag to remove
          </div>
          <Button
            onClick={() => {
              const tagArr = [...tags];
              tagArr.push(tag);
              const noDupe = Array.from(new Set(tagArr));
              setTags(noDupe);
              setTag("");
            }}
          >
            Add Tag
          </Button>
        </div>
        <div>
          <div>
            {tags.map((tag, index) => (
              <Button
                key={index}
                onClick={() => {
                  let tagArr = [...tags];
                  tagArr.splice(index, 1);
                  setTags(tagArr);
                }}
                variant="outline"
                className="ml-1 mt-1"
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepTwo;
