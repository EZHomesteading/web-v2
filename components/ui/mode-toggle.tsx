"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      {theme === "light" ? (
        <SunIcon
          onClick={() => setTheme("dark")}
          className="h-6 w-6 text-yellow-500 cursor-pointer"
        />
      ) : (
        <MoonIcon
          onClick={() => setTheme("light")}
          className="h-6 w-6 text-gray-500 cursor-pointer"
        />
      )}
    </div>
  );
}
