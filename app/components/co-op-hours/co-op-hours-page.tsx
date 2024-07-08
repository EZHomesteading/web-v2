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
      {user?.role === UserRole.COOP ? (
        <h2 className="lg:text-4xl text-3xl">Locations & Hours</h2>
      ) : (
        <h2 className="lg:text-3xl text-lg">Delivery Hours</h2>
      )}

      <ul>
        {user?.role === UserRole.COOP ? (
          <li className="text-[.6rem] sm:text-[.75rem]">
            The hours when a producer can drop produce off and buyers can pick
            up from your co-op location.
          </li>
        ) : (
          <li className="text-[.5rem] sm:text-[.75rem]">
            The hours you can deliver to a co-op.
          </li>
        )}
        <em className="text-[.5rem] sm:text-[.75rem]">
          If you set hours to closed everyday, EZH users will not be able to buy
          from you.
        </em>
      </ul>
      <Card className="flex flex-col lg:flex-row  items-center bg-inherit border-none h-fit w-full justify-center mb-6 mt-4">
        <div className="flex flex-col">
          <CardContent className="p-0 sm:w-fit lg:w-[50vw]">
            {user?.id && (
              <HoursLocationContainer
                id={user?.id}
                location={user?.location}
                apiKey={apiKey}
                role={user?.role}
              />
            )}
          </CardContent>
        </div>
      </Card>
    </>
  );
};

export default CoOpHoursPage;
