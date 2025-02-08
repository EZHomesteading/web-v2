import { OutfitFont } from "@/components/fonts";
import type { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#fff",
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className={`${OutfitFont.className} relative pl-2 2xl:pl-32`}>
        {children}
      </div>
    </>
  );
}
