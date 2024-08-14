import React from "react";
import { Textarea } from "@/app/components/ui/textarea";
import { Button } from "@/app/components/ui/button";
import Heading from "@/app/components/Heading";
import { BiLoaderCircle } from "react-icons/bi";

interface StepTwoProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  tag: string;
  setTag: (value: string) => void;
  tags: string[];
  setTags: (value: string[]) => void;
  handleSearchName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isSearching: boolean;
  items: any[];
  buildKeyWords: (desc: string) => void;
  isLoading: boolean;
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
  handleSearchName,
  isSearching,
  items,
  buildKeyWords,
  isLoading,
}) => {
  return (
    <div className="flex justify-center items-start min-h-screen w-full">
      <div className="flex flex-col gap-5 fade-in pt-[7%] w-full max-w-[500px]">
        <div className="relative">
          <input
            className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
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
          {isSearching && (
            <BiLoaderCircle
              className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin"
              size={24}
            />
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
          className="h-[30vh] shadow-sm text-[14px]"
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
