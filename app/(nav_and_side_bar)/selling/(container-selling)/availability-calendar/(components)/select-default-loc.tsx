"use client";
import { Location } from "@prisma/client";
import { UserInfo } from "next-auth";
import SetDefaultButton from "./set-default-button";

interface p {
  locations: Location[];
  user?: UserInfo;
}

const SelectDefaultLoc = ({ locations, user }: p) => {
  return (
    <div
      className={`flex flex-col justify-start 2xl:mt-[10%] text-2xl mt-[2%] items-center h-full `}
    >
      <div className={`mb-3`}>Please Set a Default Selling Location</div>
      <div className={`grid grid-cols-1 2xl:grid-cols-3 gap-1`}>
        {locations?.map((location: any, index: number) => (
          <>
            <SetDefaultButton
              key={index}
              street={location?.address[0]}
              userId={user?.id}
              locationId={location?.id}
            />
          </>
        ))}
      </div>
    </div>
  );
};

export default SelectDefaultLoc;
