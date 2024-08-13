import authCache from "@/auth-cache";
import { Outfit } from "next/font/google";
import Tab from "../tabs";
const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});
const CoopHub = async () => {
  const session = await authCache();

  return (
    <div className={`${outfit.className} grid grid-cols-12 min-h-screen`}>
      <div className="col-span-1 2xl:col-span-4"></div>
      <div className="col-span-11 2xl:col-span-7">
        <div className="grid grid-rows-10 h-full">
          <div className="row-span-1"></div>
          <div className="row-span-9">
            <div className="flex items-center gap-2 text-xs mb-10">
              Account Set Up
              <div className="bg-black w-[6px] h-[6px] rounded-full "></div>{" "}
              Co-op
              {session &&
                session.user &&
                session.user.location &&
                session.user.location[0] &&
                session.user.location[0].address &&
                session.user.location[0].address[2] !== undefined && (
                  <>
                    <div className="bg-black w-[6px] h-[6px] rounded-full "></div>{" "}
                    {session.user.location[0].address[1]}
                  </>
                )}
              <div></div>
            </div>
            <div className="text-4xl font-semibold">
              Welcome, {session?.user?.firstName}
            </div>
            <div className="mb-10 font-light">Final Steps to Start Selling</div>
            <div className="mx-5">
              <h1 className="text-2xl mb-5">Required</h1>
              <ul>
                <Tab href="/onboard" label="Add a Primary Selling Location" />

                <Tab
                  href="/onboard"
                  label="Add Open & Close Hours to Primary Selling Location"
                />
              </ul>
              <h1 className="text-2xl mb-5">Required Later</h1>
              <ul>
                <Tab href="/onboard" label={`Set Up Payouts`} />
              </ul>
              <h1 className="text-2xl mb-5">Recommended</h1>
              <ul>
                <Tab href="/onboard" label="Add a Store Bio" />{" "}
                <Tab href="/onboard" label="Add a Profile Photo" />
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoopHub;
