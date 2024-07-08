"use client";
import { UserInfo } from "@/next-auth";
import Map from "@/app/onboard/map";
interface Props {
  user: UserInfo;
  apiKey: string;
}

const CoOpHoursPage = ({ user, apiKey }: Props) => {
  return (
    <div className="flex items-center justify-center h-full">
      <Map mk={apiKey} user={user} />
    </div>

  );
};

export default CoOpHoursPage;
