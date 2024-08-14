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
    <div className="flex flex-col gap-5 p-[1px] h-[calc(100vh-114.39px)] md:h-full fade-in">
      <div className="flex md:flex-row md:items-center md:justify-between w-full flex-col items-start">
        <Heading
          title="Provide a name and description"
          subtitle="Max length of 300 characters for description"
        />
      </div>
      <div>
        <div className="w-full">
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
          {isSearching ? (
            <BiLoaderCircle
              className="absolute items-center justify-center right-[60px] top-[165px] animate-spin"
              size={40}
            />
          ) : null}
          <div className="relative">
            {items.length > 0 ? (
              <div className="absolute justify-center bg-white max-w-[200px] h-auto w-full z-20 left-0 border p-1">
                {items.map((item: any) => (
                  <div className="p-1" key={item.title}>
                    <div
                      onClick={() => {
                        setTitle(item.title);
                      }}
                      className="flex items-center justify-between w-full cursor-pointer hover:bg-gray-200 p-1 px-2"
                    >
                      {item.title}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <hr />
      <Textarea
        id="description"
        placeholder="It's recommended to include key information about your listing in the description. This will help the algorithm when users search"
        disabled={isLoading}
        className="h-[30vh] shadow-md text-[14px] bg"
        maxLength={500}
        onChange={(e) => {
          setDescription(e.target.value);
          buildKeyWords(e.target.value);
        }}
        value={description}
      />
      <div className="w-full">
        <Textarea
          id="keywords"
          placeholder="Enter Tags so users can easily search for your product, more tags means its easier to find!"
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
        <Button
          onClick={() => {
            const tagArr = [...tags];
            tagArr.push(tag);
            const noDupe = Array.from(new Set(tagArr));
            setTags(noDupe);
            setTag("");
          }}
        >
          add tag!
        </Button>
      </div>
      <div>
        click to remove a tag
        <div>
          {tags.map((tag, index) => (
            <Button
              key={index}
              onClick={() => {
                let tagArr = [...tags];
                tagArr.splice(index, 1);
                setTags(tagArr);
              }}
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepTwo;
