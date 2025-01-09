"use client";
import Container from "@/components/Container";
import Link from "next/link";
import { Outfit } from "next/font/google";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "../../../../components/ui/sheet";
import { AiOutlineMenu } from "react-icons/ai";
import MenuItem from "../../../../components/navbar/menu-item";
import { GiBarn } from "react-icons/gi";
import { useRouter } from "next/navigation";
import { CiShop } from "react-icons/ci";
import { LiaMapMarkedSolid } from "react-icons/lia";
import InfoSearchClient, {
  InfoPageValue,
} from "../../../../components/client/InfoSearchClient";
import { useState } from "react";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  weight: ["200"],
});

const Navbar = () => {
  const router = useRouter();
  const [infoPage, setInfoPage] = useState<InfoPageValue>();
  const handleChange = (value: InfoPageValue) => {
    if (value && value.href) {
      setInfoPage(value);
      router.push(value.href);
    }
  };
  return (
    <div className="relative w-full z-10 pb-2">
      <div className="py-2 sm:py-4">
        <Container>
          <div className="flex flex-row items-center justify-between">
            <div
              className={`hover:cursor-pointer text-xs sm:text-sm md:text-md lg:text-lg font-bold tracking-tight mb-2 text-grey `}
            >
              <Link href="/">
                <h1 className={`${outfit.className} hover:text-green-800`}>
                  EZ Homesteading
                </h1>
              </Link>
            </div>{" "}
            <div className="lg:w-1/4">
              {" "}
              <InfoSearchClient value={infoPage} onChange={handleChange} />
            </div>
            <Sheet>
              <SheetTrigger className="border-none p-[2px] rounded-md">
                <AiOutlineMenu className="w-8 h-8 lg:w-8 lg:h-8" />
              </SheetTrigger>

              <SheetContent
                className={`${outfit.className} bg pt-5 overflow-y-auto`}
              >
                <div>
                  <>
                    <SheetTrigger className="w-full">
                      <MenuItem
                        label="Home"
                        //icon={<GiBarn className="mr-2" />}
                        onClick={() => router.push("/market")}
                      />
                      <MenuItem
                        label="Market"
                        //icon={<CiShop className="mr-2" />}
                        onClick={() => router.push("/market")}
                      />
                      <MenuItem
                        label="Map"
                        //icon={<LiaMapMarkedSolid className="mr-2" />}
                        onClick={() => router.push("/map")}
                      />
                    </SheetTrigger>
                  </>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Navbar;
