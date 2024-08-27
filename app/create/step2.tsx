import React, { Dispatch, SetStateAction, useState } from "react";
import { Textarea } from "@/app/components/ui/textarea";
import { Button } from "@/app/components/ui/button";
import Heading from "@/app/components/Heading";
import { BiLoaderCircle } from "react-icons/bi";
import InputField from "./components/suggestion-input";
import SearchClient from "../components/client/SearchClient";
import { Checkbox } from "../components/ui/checkbox";
import { Label } from "../components/ui/label";
import debounce from "debounce";
import { FormattedProduct } from "@/hooks/use-product";

interface StepTwoProps {
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
}) => {
  const [product, setProduct] = useState<FormattedProduct>();
  const [checkbox1Checked, setCheckbox1Checked] = useState(false);
  const [subcategory, setSubcategory] = useState(subcat);
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
  const [items, setItems] = useState<any>([]);
  const [isSearching, setIsSearching] = useState(false);
  const handleSearchName = debounce(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const query = event.target.value;
      if (query === "") {
        setItems([]);
        return;
      }
      setIsSearching(true);
      try {
        const response = await fetch(
          `/api/listing/listingSuggestionsCreate?query=${encodeURIComponent(
            query
          )}`
        );
        const data = await response.json();
        if (data.listings) {
          setItems(data.listings);
        } else {
          setItems([]);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setItems([]);
      } finally {
        setIsSearching(false);
      }
    },
    1000
  );
  return (
    <div className="flex justify-center items-start min-h-screen w-full ">
      <div className="flex flex-col gap-5 fade-in pt-[10%] w-full max-w-[500px] px-4">
        <div className="relative">
          {subcategory !== "fruit" ? (
            subcategory === "custom" ? (
              <div>
                <input
                  className="flex min-h-[60px] w-full text-[16px] rounded-md border border-input bg-transparent px-3 py-2 shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  id="title"
                  placeholder="Title"
                  disabled={isLoading}
                  maxLength={64}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    handleSearchName(e);
                  }}
                  value={title}
                />
                <div className="flex flex-col gap-y-2">
                  <div className="flex flex-row gap-x-2 pt-4  items-center">
                    <Checkbox
                      checked={checkbox1Checked}
                      onCheckedChange={(checked: boolean) =>
                        handleCheckboxChange(checked)
                      }
                    />
                    <Label className="font-extralight">
                      Use a Custom Title. This will put your product up for
                      review before it goes public
                    </Label>
                  </div>
                </div>
              </div>
            ) : (
              <input
                className="flex min-h-[60px] w-full text-[16px] rounded-md border border-input bg-transparent px-3 py-2 shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                id="title"
                placeholder="Title"
                disabled={isLoading}
                maxLength={64}
                onChange={(e) => {
                  setTitle(e.target.value);
                  handleSearchName(e);
                }}
                value={title}
              />
            )
          ) : (
            <div>
              <SearchClient
                value={product}
                onChange={(value) => {
                  setProduct(value as FormattedProduct);
                  setTitle(value?.label);
                  setImageSrc([value?.photo]);
                }}
              />
              <div className="flex flex-col gap-y-2">
                <div className="flex flex-row gap-x-2 pt-4 items-center">
                  <Checkbox
                    checked={checkbox1Checked}
                    onCheckedChange={(checked: boolean) =>
                      handleCheckboxChange(checked)
                    }
                  />
                  <Label className="font-extralight">
                    Use a Custom Title. This will put your product up for review
                    before it goes public
                  </Label>
                </div>
              </div>
            </div>
          )}
        </div>
        {items.length > 0 && (
          <div className="relative w-full">
            <div className="absolute justify-center bg-white w-full z-20 left-0 border p-1">
              {items.map((item: any) => (
                <div
                  key={item.title}
                  onClick={() => setTitle(item.title)}
                  className="flex items-center justify-between w-full cursor-pointer hover:bg-gray-200 p-1 px-2"
                >
                  {item.title}
                </div>
              ))}
            </div>
          </div>
        )}
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
          <div className="mb-4 ml-[2px] mt-1 text-xs">
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
