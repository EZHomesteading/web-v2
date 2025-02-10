import { Outfit, Work_Sans, Zilla_Slab } from "next/font/google";

const OutfitFont = Outfit({
  display: "swap",
  subsets: ["latin"],
});

const ZillaFont = Zilla_Slab({
  subsets: ["latin"],
  display: "swap",
  weight: ["300"],
});

const WorkFont = Work_Sans({
  display: "block",
  subsets: ["latin"],
  weight: ["300"],
});

export { OutfitFont, ZillaFont, WorkFont };
