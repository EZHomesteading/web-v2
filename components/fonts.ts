import { Outfit, Work_Sans, Zilla_Slab } from "next/font/google";

export const outfitFont = Outfit({
  display: "swap",
  subsets: ["latin"],
});
export const zillaFont = Zilla_Slab({
  subsets: ["latin"],
  display: "swap",
  weight: ["300"],
});
export const workFont = Work_Sans({
  display: "block",
  subsets: ["latin"],
  weight: ["300"],
});