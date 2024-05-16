"use client";
import { useState } from "react";
import { Checkbox } from "@/app/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";

interface p {
  disputes: any;
  setFilteredDisputes: any;
}

const FilterButtons = ({ disputes, setFilteredDisputes }: p) => {
  const [sortOrder, setSortOrder] = useState<string[]>([]);

  const sortDisputes = (order: string) => {
    let sortedDisputes = [...disputes];
    let updatedSortOrder: string[] = [];

    if (order === "") {
      updatedSortOrder = [];
      sortedDisputes = disputes;
    } else {
      if (order === "statusLowToHigh") {
        updatedSortOrder = sortOrder.filter((o) => o !== "statusHighToLow");
      } else if (order === "statusHighToLow") {
        updatedSortOrder = sortOrder.filter((o) => o !== "statusLowToHigh");
      } else if (order === "createdAtLowToHigh") {
        updatedSortOrder = sortOrder.filter((o) => o !== "createdAtHighToLow");
      } else if (order === "createdAtHighToLow") {
        updatedSortOrder = sortOrder.filter((o) => o !== "createdAtLowToHigh");
      }

      if (sortOrder.includes(order)) {
        updatedSortOrder = sortOrder.filter((o) => o !== order);
      } else {
        updatedSortOrder = [...sortOrder, order];
      }

      if (updatedSortOrder.includes("statusLowToHigh")) {
        sortedDisputes.sort((a, b) => a.status - b.status);
      } else if (updatedSortOrder.includes("statusHighToLow")) {
        sortedDisputes.sort((a, b) => b.status - a.status);
      } else if (updatedSortOrder.includes("createdAtLowToHigh")) {
        sortedDisputes.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      } else if (updatedSortOrder.includes("createdAtHighToLow")) {
        sortedDisputes.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
    }

    setFilteredDisputes(sortedDisputes);
    setSortOrder(updatedSortOrder);
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="bg-gray-500 text-white px-2 py-1 rounded">
          Filter
        </button>
      </PopoverTrigger>
      <PopoverContent className="bg-white p-4 rounded shadow-lg">
        <div className="space-y-2">
          <div className="flex items-center">
            <Checkbox
              id="statusLowToHigh"
              checked={sortOrder.includes("statusLowToHigh")}
              onCheckedChange={(checked: any) =>
                sortDisputes(checked ? "statusLowToHigh" : "")
              }
            />
            <label
              htmlFor="statusLowToHigh"
              className="ml-2 text-sm font-medium text-gray-900"
            >
              Status: Low to High
            </label>
          </div>
          <div className="flex items-center">
            <Checkbox
              id="statusHighToLow"
              checked={sortOrder.includes("statusHighToLow")}
              onCheckedChange={(checked: any) =>
                sortDisputes(checked ? "statusHighToLow" : "")
              }
            />
            <label
              htmlFor="statusHighToLow"
              className="ml-2 text-sm font-medium text-gray-900"
            >
              Status: High to Low
            </label>
          </div>
          <div className="flex items-center">
            <Checkbox
              id="createdAtLowToHigh"
              checked={sortOrder.includes("createdAtLowToHigh")}
              onCheckedChange={(checked: any) =>
                sortDisputes(checked ? "createdAtLowToHigh" : "")
              }
            />
            <label
              htmlFor="createdAtLowToHigh"
              className="ml-2 text-sm font-medium text-gray-900"
            >
              Date Created: Low to High
            </label>
          </div>
          <div className="flex items-center">
            <Checkbox
              id="createdAtHighToLow"
              checked={sortOrder.includes("createdAtHighToLow")}
              onCheckedChange={(checked: any) =>
                sortDisputes(checked ? "createdAtHighToLow" : "")
              }
            />
            <label
              htmlFor="createdAtHighToLow"
              className="ml-2 text-sm font-medium text-gray-900"
            >
              Date Created: High to Low
            </label>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FilterButtons;
