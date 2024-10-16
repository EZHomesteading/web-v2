"use client";
import { Outfit } from "next/font/google";
import FinTab from "./fintab";
import { Session } from "next-auth";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Location, UserRole } from "@prisma/client";
import { useRouter } from "next/navigation";
import axios from "axios";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});
interface Props {
  location: Location | null;
  session: Session;
  canReceivePayouts: boolean | null;
  stepHandler: (arg0: number) => void;
}
const StepOne = ({
  session,
  canReceivePayouts,
  stepHandler,
  location,
}: Props) => {
  const router = useRouter();
  const consumerUpdate = async () => {
    try {
      await axios.post("/api/useractions/update", {
        role: "PRODUCER",
        hasPickedRole: false,
      });
    } catch (error) {
    } finally {
      router.refresh();
    }
  };
  console.log(session?.user.stripeAccountId);
  console.log(session?.user.role);
  if (session?.user.role === "CONSUMER") {
    consumerUpdate();
  }
  return (
    <div className={`${outfit.className} grid grid-cols-12`}>
      <div className="col-span-1 2xl:col-span-4"></div>
      <div className="col-span-11 2xl:col-span-7">
        <div className="grid grid-rows-10 h-full">
          <div className="row-span-1 hidden sm:block"></div>
          <div className="row-span-9">
            <div className="flex items-center gap-2 text-xs mb-10">
              Account Set Up
              <div className="bg-black w-[6px] h-[6px] rounded-full "></div>{" "}
              {session?.user?.role === UserRole.COOP ? (
                <>Co-op</>
              ) : (
                <>Producer</>
              )}
              {session &&
                session.user &&
                location &&
                location.address &&
                location.address[2] !== undefined && (
                  <>
                    <div className="bg-black w-[6px] h-[6px] rounded-full "></div>{" "}
                    {location.address[1]}
                  </>
                )}
              <div></div>
            </div>
            <div className="text-4xl font-semibold">
              Welcome, {session?.user?.firstName || session?.user?.name}
            </div>
            <div className="mb-10 font-light">Final Steps to Start Selling</div>
            <div className="mb-10 font-light">
              Some additional information is required before you can start
              listing items
            </div>

            <div className="mx-5">
              <h1 className="text-2xl mb-5">Required to Begin Selling</h1>
              <ul>
                {session?.user?.hasPickedRole === false ? (
                  <>
                    <div className="md:w-[75%] lg:w-[50%] xl:w-[40%] 2xl:w-[55%]">
                      <div
                        onClick={() => {
                          stepHandler(2);
                        }}
                        className="flex justify-between mx-5 items-center hover:cursor-pointer"
                      >
                        <li>Select your Seller Role</li>
                        <MdKeyboardArrowRight />
                      </div>
                      <div className="my-5 border border-b-[1px]"></div>
                    </div>
                  </>
                ) : (
                  <>
                    <FinTab label="Role has been selected" />
                  </>
                )}
                {location && location.address ? (
                  <FinTab label="You already set a Primary Selling Location" />
                ) : (
                  <div className="md:w-[75%] lg:w-[50%] xl:w-[40%] 2xl:w-[55%]">
                    <div
                      onClick={() => {
                        stepHandler(5);
                      }}
                      className="flex justify-between mx-5 items-center hover:cursor-pointer"
                    >
                      <li>Add a Primary Selling Location</li>
                      <MdKeyboardArrowRight />
                    </div>
                    <div className="my-5 border border-b-[1px]"></div>
                  </div>
                )}
                {location && location.hours ? (
                  <FinTab label="You already set a Hours for your Primary Selling Location" />
                ) : (
                  <div className="md:w-[75%] lg:w-[50%] xl:w-[40%] 2xl:w-[55%]">
                    <div
                      onClick={() => {
                        stepHandler(6);
                      }}
                      className="flex justify-between mx-5 items-center hover:cursor-pointer"
                    >
                      <li>
                        Add Open & Close Hours to Primary Selling Location
                      </li>
                      <MdKeyboardArrowRight />
                    </div>
                    <div className="my-5 border border-b-[1px]"></div>
                  </div>
                )}
              </ul>
              <h1 className="text-2xl mb-5">Recommended</h1>
              <ul>
                {session?.user && session?.user?.image ? (
                  <FinTab label="You already set a Profile Photo" />
                ) : (
                  <div className="md:w-[75%] lg:w-[50%] xl:w-[40%] 2xl:w-[55%]">
                    <div
                      onClick={() => {
                        stepHandler(8);
                      }}
                      className="flex justify-between mx-5 items-center hover:cursor-pointer"
                    >
                      <li>Add a Profile Photo</li>
                      <MdKeyboardArrowRight />
                    </div>
                    <div className="my-5 border border-b-[1px]"></div>
                  </div>
                )}
                {session?.user && session?.user?.bio ? (
                  <FinTab label="You already set a Store Bio" />
                ) : (
                  <div className="md:w-[75%] lg:w-[50%] xl:w-[40%] 2xl:w-[55%]">
                    <div
                      onClick={() => {
                        stepHandler(9);
                      }}
                      className="flex justify-between mx-5 items-center hover:cursor-pointer"
                    >
                      <li>Add a Store Bio</li>
                      <MdKeyboardArrowRight />
                    </div>
                    <div className="my-5 border border-b-[1px]"></div>
                  </div>
                )}
              </ul>
              <h1 className="text-2xl mb-5">Required To Get Paid</h1>
              <ul>
                {canReceivePayouts === true ? (
                  <FinTab label={`Payouts are set up!`} />
                ) : (
                  <div className="md:w-[75%] lg:w-[50%] xl:w-[40%] 2xl:w-[55%]">
                    <div
                      onClick={() => {
                        stepHandler(10);
                      }}
                      className="flex justify-between mx-5 items-center hover:cursor-pointer"
                    >
                      <li>Set Up Payouts</li>
                      <MdKeyboardArrowRight />
                    </div>
                    <div className="my-5 border border-b-[1px]"></div>
                  </div>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepOne;
