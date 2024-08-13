import { Outfit } from "next/font/google";
import FinTab from "./fintab";
import { Session } from "next-auth";
import { MdKeyboardArrowRight } from "react-icons/md";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});
interface Props {
  session: Session;
  canReceivePayouts: boolean | null;
  stepHandler: (arg0: number) => void;
}
const StepOne: React.FC<Props> = async ({
  session,
  canReceivePayouts,
  stepHandler,
}) => {
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
                {session?.user?.location &&
                session?.user?.location[0]?.address ? (
                  <FinTab label="You already set a Primary Selling Location" />
                ) : (
                  <div className="md:w-[75%] lg:w-[50%] xl:w-[40%] 2xl:w-[55%]">
                    <div
                      onClick={() => {
                        stepHandler(3);
                      }}
                      className="flex justify-between mx-5 items-center hover:cursor-pointer"
                    >
                      <li>Add a Primary Selling Location</li>
                      <MdKeyboardArrowRight />
                    </div>
                    <div className="my-5 border border-b-[1px]"></div>
                  </div>
                )}
                {session?.user?.location &&
                session?.user?.location[0]?.hours ? (
                  <FinTab label="You already set a Hours for your Primary Selling Location" />
                ) : (
                  <div className="md:w-[75%] lg:w-[50%] xl:w-[40%] 2xl:w-[55%]">
                    <div
                      onClick={() => {
                        stepHandler(4);
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
                        stepHandler(6);
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
                        stepHandler(7);
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
                        stepHandler(9);
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
