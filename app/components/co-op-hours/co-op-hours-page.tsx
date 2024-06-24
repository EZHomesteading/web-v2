"use client";
import { UserInfo } from "@/next-auth";
import { Outfit } from "next/font/google";
import { Card, CardContent } from "../ui/card";
import { UserRole } from "@prisma/client";

import HoursLocationContainer from "@/app/dashboard/my-store/settings/location-hours-container";
const outfit = Outfit({ subsets: ["latin"] });

interface Props {
  user: UserInfo;
  apiKey: string;
}

const CoOpHoursPage = ({ user, apiKey }: Props) => {
  return (
    <>
      <Card className={` ${outfit.className} w-full border-none`}>
        <CardContent className="flex flex-col sheet  border-none w-full pb-0 md:pt-20 pt-0">
          {user?.role === UserRole.COOP ? (
            <h2 className="lg:text-4xl text-3xl">Locations & Hours</h2>
          ) : (
            <h2 className="lg:text-3xl text-lg">Delivery Hours</h2>
          )}

          <ul>
            {user?.role === UserRole.COOP ? (
              <li className="text-[.6rem] sm:text-[.75rem]">
                The hours when a producer can drop produce off and buyers can
                pick up from your listing or co-op location.
              </li>
            ) : (
              <li className="text-[.5rem] sm:text-[.75rem]">
                The hours you can deliver to a co-op.
              </li>
            )}
            <em className="text-[.5rem] sm:text-[.75rem]">
              If you set hours to closed everyday, EZH users will not be able to
              buy from you.
            </em>
          </ul>
          <Card className="flex flex-col lg:flex-row  items-center bg-inherit border-none h-fit w-full justify-center mb-6 mt-4">
            <div className="flex flex-col">
              <CardContent className="p-0 sm:w-fit lg:w-[50vw]">
                <HoursLocationContainer
                  location={user?.location}
                  apiKey={apiKey}
                />
              </CardContent>
            </div>
          </Card>
        </CardContent>
      </Card>
      {/* <Card className="flex flex-col bg-inherit w-full border-none">
        <CardContent
          className={`${outfit.className} border-t-[1px] border-neutal-200 pt-3`}
        >
          {user?.role === UserRole.COOP ? (
            <h2 className="text-3xl lg:text-4xl">Set Out Time</h2>
          ) : (
            <h2 className="text-3xl lg:text-4xl">Time to Begin Delivery</h2>
          )}
          <ul>
            {user?.role === UserRole.COOP ? (
              <li className="text-[.5rem] sm:text-sm">
                This is the amount of time it takes between you{" "}
                <em>agreeing </em> to a pick up time and preparing the order.
              </li>
            ) : (
              <li className="text-[.5rem] sm:text-sm">
                This is the amount of time it takes between you{" "}
                <em>agreeing to delivery time</em> and preparing it for
                delivery.
              </li>
            )}
            <li className="text-[.5rem] sm:text-sm mt-2">
              <em>
                This is important to understand.{" "}
                <Link href="/info/sodt" className="text-blue-500">
                  More Info
                </Link>
              </em>
            </li>
          </ul>
          <div className="justify-end flex">
            <label
              htmlFor="sodt"
              className="block text-sm font-medium leading-6"
            ></label>

            <Select
              onValueChange={(value) => setSODT(parseInt(value, 10))}
              // value={SODT.toString()}
            >
              <SelectTrigger className="w-fit h-1/6 bg-slate-300 text-black text-xl">
                <SelectValue placeholder={SODT || "Select a Time"} />
              </SelectTrigger>
              <SelectContent className={`${outfit.className} bg-slate-300`}>
                <SelectGroup>
                  <SelectItem value="15">15 Minutes</SelectItem>
                  <SelectItem value="30">30 Minutes</SelectItem>
                  <SelectItem value="45">45 Minutes</SelectItem>
                  <SelectItem value="60">1 Hour</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card> */}
    </>
  );
};

export default CoOpHoursPage;
