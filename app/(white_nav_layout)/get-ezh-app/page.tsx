"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FaAndroid } from "react-icons/fa";
import { FaApple } from "react-icons/fa";
import { FaLinux } from "react-icons/fa";
import PwaInstall from "./pwa";
import { BsWindows } from "react-icons/bs";
import { useEffect, useState } from "react";
import Navbar from "../../../components/navbar/Navbar";
import { useCurrentUser } from "@/hooks/user/use-current-user";

import { NavUser } from "@/actions/getUser";
import { outfitFont, zillaFont } from "@/components/fonts";

enum DEVICE {
  ANDROID = "Android",
  IOS = "iOS",
  WINDOWS = "Windows",
  MAC = "Mac",
  LINUX = "Linux",
  UNKNOWN = "Unknown",
}

enum BROWSER {
  CHROME = "Chrome",
  SAFARI = "Safari",
  FIREFOX = "Firefox",
  EDGE = "Edge",
  UNKNOWN = "Unknown",
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}
const Page = () => {
  const [device, setDevice] = useState(DEVICE.UNKNOWN);
  const [browser, setBrowser] = useState(BROWSER.UNKNOWN);

  useEffect(() => {
    const userAgent = navigator.userAgent;
    if (/Android/i.test(userAgent)) {
      setDevice(DEVICE.ANDROID);
    } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
      setDevice(DEVICE.IOS);
    } else if (/Win/i.test(userAgent)) {
      setDevice(DEVICE.WINDOWS);
    } else if (/Mac/i.test(userAgent)) {
      setDevice(DEVICE.MAC);
    } else if (/Linux/i.test(userAgent)) {
      setDevice(DEVICE.LINUX);
    }

    if (/Chrome/i.test(userAgent)) {
      setBrowser(BROWSER.CHROME);
    } else if (/Safari/i.test(userAgent)) {
      setBrowser(BROWSER.SAFARI);
    } else if (/Firefox/i.test(userAgent)) {
      setBrowser(BROWSER.FIREFOX);
    } else if (/Edge/i.test(userAgent)) {
      setBrowser(BROWSER.EDGE);
    }
  }, []);

  const AndroidComponent = () => (
    <div>
      <h3>Android Installation</h3>
      <ul className="list-disc">
        <li>Press the three dots in the browser</li>
        <li>Press 'Install App'</li>
        <li>Press on the EZHomesteading Icon to open the app</li>
      </ul>
    </div>
  );

  const IOSSafariComponent = () => (
    <div>
      <h3>iOS Installation</h3>
      <ul className="list-disc">
        <li>Press the Share Button within the browser</li>
        <li>Press 'Add to Homescreen'</li>
        <li>Press on the EZHomesteading Icon to open the app</li>
      </ul>
    </div>
  );

  const IOSOtherBrowserComponent = () => (
    <div className="text-red-500">
      <h3>iOS only supports Progessive Web App installations in safari</h3>
      <p>Please visit this same page in safari to complete the installation</p>
    </div>
  );

  const WindowsComponent = () => (
    <div className={`${zillaFont.className} text-lg`}>
      <PwaInstall />
    </div>
  );

  const MacComponent = () => (
    <div>
      <h3>Mac-specific content</h3>
      <p>This is dummy content for Mac devices.</p>
    </div>
  );

  const LinuxComponent = () => (
    <div>
      <h3>Linux-specific content</h3>
      <p>This is dummy content for Linux devices.</p>
    </div>
  );
  const user = useCurrentUser();
  return (
    <div className="bg grid grid-cols-1 lg:grid-cols-5 pt-[5%] px-4 min-h-screen relative">
      <Navbar user={user as unknown as NavUser} />
      <div className="lg:col-span-1 hidden lg:block"></div>
      <div className="col-span-3 lg:col-span-2 xl:col-span-2">
        <h2 className={`${outfitFont.className} pt-10 lg:text-5xl text-2xl`}>
          Get the EZ Homesteading App
        </h2>
        <div>
          <div className={`${zillaFont.className} lg:text-xl mb-1`}>
            The user experience on the app is significantly better
          </div>

          <ul
            className={`${zillaFont.className} text-[.75rem] lg:text-lg list-disc lg:mx-8 my-5`}
          >
            <li>Full screen display</li>
            <li className="list-sqaure">
              EZH appears seperately on the app list for easier navigation
              between EZH and other apps
            </li>
            <li>
              Create a shortcut on your device for quicker and easier startup
            </li>
            <li>Automatically syncs with the website with more features</li>
            <li>No Play Store/App Store installation required</li>
          </ul>
          <div className="grid 2xl:grid-rows-1  2xl:grid-cols-4 w-[100%] gap-2 ">
            <div className="grid grid-cols-2 2xl:grid-cols-1">
              <Card className="grid-row-1 2xl:grid-col-1 sheet shadow-md">
                <CardHeader
                  className={`${outfitFont.className} text-7xl font-semibold`}
                >
                  90%
                </CardHeader>
                <CardContent className={`${outfitFont.className} text-2xl`}>
                  Browser Support
                </CardContent>
              </Card>
              <div className="grid-col-1 2xl:hidden"></div>
            </div>
            <Card className="sheet 2xl:grid-col-3 grid-row-1 shadow-md 2xl:w-[700px]">
              <CardHeader
                className={`${outfitFont.className} text-3xl font-semibold`}
              >
                Compatible With
              </CardHeader>
              <CardContent className="grid grid-cols-4 gap-x-2">
                <Card>
                  <CardContent className="sheet h-[100px] shadow-md rounded-lg flex items-center justify-center pb-0">
                    <FaApple className="text-7xl" />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="sheet h-[100px] shadow-md rounded-lg flex items-center justify-center pb-0">
                    <FaAndroid className="text-[5rem] mt-2" />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="sheet h-[100px] shadow-md rounded-lg flex items-center justify-center pb-0">
                    <FaLinux className="text-7xl" />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="sheet h-[100px] shadow-md rounded-lg flex items-center justify-center pb-0">
                    <BsWindows className="text-7xl" />
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>
          <h2 className={`${outfitFont.className} text-5xl`}>
            Installation Guide
          </h2>
          {device === DEVICE.ANDROID && <AndroidComponent />}
          {device === DEVICE.IOS && browser === BROWSER.SAFARI ? (
            <IOSSafariComponent />
          ) : device === DEVICE.IOS ? (
            <IOSOtherBrowserComponent />
          ) : null}
          {device === DEVICE.WINDOWS && <WindowsComponent />}
          {device === DEVICE.MAC && <MacComponent />}
          {device === DEVICE.LINUX && <LinuxComponent />}
        </div>
        <ul>
          <li>device: {device}</li>
          <li>browser: {browser}</li>
        </ul>
      </div>
    </div>
  );
};

export default Page;
