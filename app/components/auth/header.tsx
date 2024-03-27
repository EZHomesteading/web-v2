import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

interface HeaderProps {
  label: string;
}

export const Header = ({ label }: HeaderProps) => {
  return (
    <>
      <div className="w-full flex flex-col gap-y-4 items-start justify-center">
        <p className="text-muted-foreground text-3xl">{label}</p>
      </div>
    </>
  );
};
