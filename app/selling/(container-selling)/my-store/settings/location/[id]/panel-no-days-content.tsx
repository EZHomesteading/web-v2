"use client";
import AccountCard from "@/app/account/(sidebar-container)/personal-info/account-card";
import { Sheet, SheetContent, SheetTrigger } from "@/app/components/ui/sheet";
import Map from "@/app/onboard/map";
import { UserInfo } from "@/next-auth";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
const locationHeadings = [
  { text: "Default Location", style: "text-xl mt-2 font-bold" },
  { text: "Secondary Location", style: "text-xl mt-2 font-semibold" },
  { text: "Third Location", style: "text-xl mt-2 font-medium" },
];
interface p {
  mk: string;
  locationIndex: number;
  user?: UserInfo;
  location: any;
}
const Client = ({ mk, locationIndex, user, location }: p) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 641);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);
  const heading = locationHeadings[locationIndex] || {
    text: "Location",
    style: "text-xl mt-2 font-bold",
  };
  return (
    <>
      {" "}
      <div className="flex flex-col md:flex-row w-full relative">
        <div className="w-full sm:w-2/3 ">
          <h1 className={heading.style}>{heading.text}</h1>
          <AccountCard
            title="Address"
            info={location?.address?.join(", ")}
          ></AccountCard>

          <div className="mt-4">
            <h2 className="text-lg font-normal">Current Hours</h2>
          </div>
        </div>
        {isSmallScreen ? (
          <>
            <Sheet>
              <SheetTrigger className="w-full fixed bottom-[89px] right-0 z-10">
                <div className="h-[75px] overflow-hidden rounded-t-xl">
                  <Map
                    user={user}
                    center={{
                      lat: location.lat || 38,
                      lng: location.lng || -79,
                    }}
                    mk={mk}
                    showSearchBar={false}
                    h={75}
                  />
                </div>
              </SheetTrigger>
              <SheetContent
                side={`bottom`}
                className="fixed inset-0 w-full h-full p-0 m-0"
              >
                <div className="md:pt-4">
                  <Map
                    user={user}
                    center={{
                      lat: location.lat || 38,
                      lng: location.lng || -79,
                    }}
                    mk={mk}
                    showSearchBar={false}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </>
        ) : (
          <>
            <div className="pt-5 px-10">
              <Map
                user={user}
                center={{
                  lat: location.lat || 38,
                  lng: location.lng || -79,
                }}
                mk={mk}
                showSearchBar={false}
                w={500}
                h={600}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};
export default Client;
