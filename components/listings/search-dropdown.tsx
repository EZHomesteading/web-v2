"use client";

import { Listing } from "@prisma/client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import Link from "next/link";

export type ListingSearchResult = {
  name: string;
  image_url: string | null;
}[];

type SearchResult = { name: string; image_url: string | null };
export function SearchDropDownComponent({ apiUrl }: { apiUrl: string }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredListings, setFilteredListings] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchTerm.length === 0) {
      setFilteredListings([]);
    } else {
      setIsLoading(true);

      const searchedFor = searchTerm;

      fetch(`${apiUrl}/search?q=${searchTerm}`).then(async (results) => {
        const currentSeachTerm = inputRef.current?.value;
        if (currentSeachTerm != searchedFor) {
          return;
        }

        const json = await results.json();
        setIsLoading(false);
        setFilteredListings(json as ListingSearchResult);
      });
    }
  }, [searchTerm, inputRef]);

  const params = useParams();
  useEffect(() => {
    if (!params?.product) {
      const subcategory = params?.subcategory;
      setSearchTerm(
        typeof subcategory === "string" ? subcategory.replaceAll("-", " ") : ""
      );
    }
  }, [params]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      setHighlightedIndex((prevIndex) =>
        prevIndex < filteredListings?.length - 1 ? prevIndex + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : filteredListings.length - 1
      );
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      //   router.push(filteredListings[highlightedIndex]?.href);
      setSearchTerm(filteredListings[highlightedIndex].name);
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="font-sans" ref={dropdownRef}>
      <div className="relative flex-grow">
        <div className="relative">
          <Input
            ref={inputRef}
            autoCapitalize="off"
            autoCorrect="off"
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(e.target.value.length > 0);
              setHighlightedIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            className="pr-12 font-sans font-medium sm:w-[300px] md:w-[375px]"
          />
          <X
            className={cn(
              "absolute right-7 top-2 h-5 w-5 text-muted-foreground",
              {
                hidden: !isOpen,
              }
            )}
            onClick={() => {
              setSearchTerm("");
              setIsOpen(false);
            }}
          />
        </div>
        {isOpen && (
          <div className="absolute z-10 w-full border border-gray-200 bg-white shadow-lg">
            <ScrollArea className="h-[300px]">
              {filteredListings.length > 0 ? (
                filteredListings.map((item, index) => (
                  <Link href={``} key={index} prefetch={true}>
                    <div
                      className={cn("flex cursor-pointer items-center p-2", {
                        "bg-gray-100": index === highlightedIndex,
                      })}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      onClick={() => {
                        setSearchTerm(item.name);
                        setIsOpen(false);
                        inputRef.current?.blur();
                      }}
                    >
                      <span className="text-sm">{item.name}</span>
                    </div>
                  </Link>
                ))
              ) : isLoading ? (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-gray-500">Loading...</p>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-gray-500">No results found</p>
                </div>
              )}
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
}
