import Link from "next/link";
import { Outfit } from "next/font/google";
import SubToggle from "../chat/components/notificationButton";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

const StepNotif = () => {
  return (
    <>
      <div className="flex items-center sm:justify-center h-full px-20 ">
        <div
          className={`w-full max-w-2xl flex flex-col items-start text-start ${outfit.className}`}
        >
          <div className="text-3xl sm:text-6xl ">Chat Notifications</div>
          <div className="text-xs sm:text-base mt-2 font-extralight">
            Allow us to send notifications for chats you receive from buyers. If
            you are on a apple device you will be required to install our app if
            you want to receive push notifications. directions for this can be
            found{" "}
            <Link className="underline" href={"/get-ezh-app"}>
              HERE
            </Link>
            <div className="flex flex-row justify-center mt-5 text-xs sm:text-sm gap-x-1 sm:gap-x-3">
              {" "}
              <div>
                {" "}
                Enable/Disable Notifications for this device? This can be
                changed any time by clicking the bell in the{" "}
                <Link className="underline" href={"/chat"}>
                  CHAT PAGE
                </Link>{" "}
                or by clicking the bell here.
              </div>
              <SubToggle></SubToggle>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StepNotif;
