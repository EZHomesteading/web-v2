//help button handler
import Heading from "@/components/Heading";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import { useEffect, useState } from "react";
import titleHelp from "@/public/images/website-images/apple.jpg";
import shelfLife from "@/public/images/info/shelfLife.jpg";
import ezhOrganicRating from "@/public/images/info/ezhOrganicRating.jpg";
import titleNotFound from "@/public/images/website-images/stepOneTitle404.jpg";
import minOrder from "@/public/images/info/minOrder.jpg";
import addPhotos from "@/public/images/how-to/takePhotos.jpg";
import Link from "next/link";
import { OutfitFont, ZillaFont } from "@/components/fonts";

interface p {
  step: number;
  role?: string;
}
const Help = ({ step, role }: p) => {
  const isMdOrLarger = useMediaQuery("(min-width: 768px)");
  return (
    <Sheet>
      {step !== 1 && (
        <SheetTrigger className="zmax bg-primary text-primary-foreground shadow hover:bg-primary/90 inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 fixed sm:top-5 sm:right-5 bottom-6 right-1/2 translate-x-1/2 sm:translate-x-0  px-4 py-2 text-xl h-9 w-[74px]">
          Help
        </SheetTrigger>
      )}

      <SheetContent
        side={isMdOrLarger ? "right" : "bottom"}
        className={`${OutfitFont.className} h-[70vh] md:h-full pt-4 px-3 w-screen md:w-1/3 2xl:w-1/5 zmax`}
      >
        <Heading title="Help In This Section" />
        {step === 2 && (
          <>
            <Link
              href="/info/how-to/listing/add-title"
              target="_blank"
              rel="noreferrer noopener"
            >
              <Card className="hover:cursor-pointer border-none mt-2">
                <CardContent className="p-0 rounded-lg relative flex items-center gap-x-2 border-[1px] shadow-sm ">
                  <Image
                    src={titleHelp}
                    alt="Help With Title"
                    width={120}
                    height={120}
                    className="object-cover rounded-l-lg aspect-sqaure"
                    style={{ width: "120px", height: "120px" }}
                  />
                  <div>
                    <h1 className="text-sm">How do I add a title?</h1>
                    <p
                      className={`${ZillaFont.className} text-xs text-neutral-600`}
                    >
                      1 min read
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link
              href="/info/how-to/listing/suggest-listing"
              target="_blank"
              rel="noreferrer noopener"
            >
              <Card className="hover:cursor-pointer border-none mt-2">
                <CardContent className="p-0 rounded-lg relative flex items-center gap-x-2 border-[1px] shadow-sm ">
                  <Image
                    src={titleNotFound}
                    alt="Can't find title"
                    width={120}
                    height={120}
                    className="object-cover rounded-l-lg aspect-sqaure"
                    style={{ width: "120px", height: "120px" }}
                  />
                  <div>
                    <h1 className="text-sm">
                      I don't see my item in the seach
                    </h1>
                    <p
                      className={`${ZillaFont.className} text-xs text-neutral-600`}
                    >
                      2 min read
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </>
        )}
        {step === 3 && (
          <>
            <Link
              href="/info/specifics/listing/min-order"
              target="_blank"
              rel="noreferrer noopener"
            >
              <Card className="hover:cursor-pointer border-none mt-2">
                <CardContent className="p-0 rounded-lg relative flex items-center gap-x-2 border-[1px] shadow-sm ">
                  <Image
                    src={minOrder}
                    alt="Help With Title"
                    width={120}
                    height={120}
                    className="object-cover rounded-l-lg aspect-sqaure"
                    style={{ width: "120px", height: "120px" }}
                  />
                  <div>
                    <h1 className="text-sm">What is a Minimum Order?</h1>
                    <p
                      className={`${ZillaFont.className} text-xs text-neutral-600`}
                    >
                      1 min read
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            {role === "COOP" ? (
              <Link
                href="/info/specifics/listing/coop-sodt"
                target="_blank"
                rel="noreferrer noopener"
              >
                <Card className="hover:cursor-pointer border-none mt-2">
                  <CardContent className="p-0 rounded-lg relative flex items-center gap-x-2 border-[1px] shadow-sm ">
                    <Image
                      src={minOrder}
                      alt="Help With set out time"
                      width={120}
                      height={120}
                      className="object-cover rounded-l-lg aspect-sqaure"
                      style={{ width: "120px", height: "120px" }}
                    />
                    <div>
                      <h1 className="text-sm">What is Set out Time?</h1>
                      <p
                        className={`${ZillaFont.className} text-xs text-neutral-600`}
                      >
                        2 min read
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ) : (
              <Link
                href="/info/specifics/listing/producer-sodt"
                target="_blank"
                rel="noreferrer noopener"
              >
                <Card className="hover:cursor-pointer border-none mt-2">
                  <CardContent className="p-0 rounded-lg relative flex items-center gap-x-2 border-[1px] shadow-sm ">
                    <Image
                      src={minOrder}
                      alt="Help With set out time"
                      width={120}
                      height={120}
                      className="object-cover rounded-l-lg aspect-sqaure"
                      style={{ width: "120px", height: "120px" }}
                    />
                    <div>
                      <h1 className="text-sm">What Does Delivery Time Mean?</h1>
                      <p
                        className={`${ZillaFont.className} text-xs text-neutral-600`}
                      >
                        2 min read
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )}
          </>
        )}
        {step === 4 && (
          <>
            <Link
              href="/info/specifics/listing/shelf-life"
              target="_blank"
              rel="noreferrer noopener"
            >
              <Card className="hover:cursor-pointer border-none mt-2">
                <CardContent className="p-0 rounded-lg relative flex items-center gap-x-2 border-[1px] shadow-sm ">
                  <Image
                    src={shelfLife}
                    alt="Help With Title"
                    width={120}
                    height={120}
                    className="object-cover rounded-l-lg aspect-sqaure"
                    style={{ width: "120px", height: "120px" }}
                  />
                  <div>
                    <h1 className="text-sm">What Does Shelf Life Mean?</h1>
                    <p
                      className={`${ZillaFont.className} text-xs text-neutral-600`}
                    >
                      1 min read
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </>
        )}
        {step === 5 && (
          <>
            {" "}
            <Link
              href="/info/specifics/listing/ezh-organic-rating"
              target="_blank"
              rel="noreferrer noopener"
            >
              <Card className="hover:cursor-pointer border-none mt-2">
                <CardContent className="p-0 rounded-lg relative flex items-center gap-x-2 border-[1px] shadow-sm ">
                  <Image
                    src={ezhOrganicRating}
                    alt="Help With Title"
                    width={120}
                    height={120}
                    className="object-cover rounded-l-lg aspect-sqaure"
                    style={{ width: "120px", height: "120px" }}
                  />
                  <div>
                    <h1 className="text-sm">What is the EZH Organic Rating?</h1>
                    <p
                      className={`${ZillaFont.className} text-xs text-neutral-600`}
                    >
                      1 min read
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </>
        )}
        {step === 6 && (
          <>
            <Link
              href={
                isMdOrLarger
                  ? "/info/how-to/listing/add-photos/desktop"
                  : "/info/how-to/listing/add-photos/mobile"
              }
              target="_blank"
              rel="noreferrer noopener"
            >
              <Card className="hover:cursor-pointer border-none mt-2">
                <CardContent className="p-0 rounded-lg relative flex items-center gap-x-2 border-[1px] shadow-sm ">
                  <Image
                    src={addPhotos}
                    alt="Help With Title"
                    width={120}
                    height={120}
                    className="object-cover rounded-l-lg aspect-sqaure"
                    style={{ width: "120px", height: "120px" }}
                  />
                  <div>
                    <h1 className="text-sm">
                      {isMdOrLarger
                        ? "How to add Photos on Desktop"
                        : "How to add Photos on Mobile"}
                    </h1>
                    <p
                      className={`${ZillaFont.className} text-xs text-neutral-600`}
                    >
                      1 min read
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Help;

const useMediaQuery = (query: any) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: any) => setMatches(event.matches);
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);

  return matches;
};
