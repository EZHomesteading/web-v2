"use client";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader } from "@/app/components/ui/card";
import { Outfit, Zilla_Slab } from "next/font/google";
import { TfiDownload } from "react-icons/tfi";
import { FaAndroid } from "react-icons/fa";
import { FaApple } from "react-icons/fa";
import { FaLinux } from "react-icons/fa";
import PWAInstall from "@/app/(home)/get-ezh-app/pwa";
import { BsWindows } from "react-icons/bs";
import { useEffect, useState } from "react";

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

const outfit = Outfit({
  display: "swap",
  subsets: ["latin"],
});
const zilla = Zilla_Slab({
  display: "swap",
  weight: ["300"],
  subsets: ["latin"],
});
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
      <h3>Android-specific content</h3>
      <p>This is dummy content for Android devices.</p>
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
    <div className={`${zilla.className} text-lg`}>
      <h3>Press the Install Button Below</h3>
      <Button className={`${outfit.className} text-xl font-light`}>
        Install
      </Button>
      <p>or</p>
      <ul>
        <li>Press the download button on the right side of search bar</li>
        <li>Press Install</li>
      </ul>
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

  const openPWA = () => {
    window.location.href = "/manifest.json";
  };

  return (
    <div className="bg grid grid-cols-1 lg:grid-cols-5 pt-[5%] px-4 min-h-screen">
      <div className="lg:col-span-1 hidden lg:block"></div>
      <div className="col-span-3 lg:col-span-2 xl:col-span-2">
        <h2 className={`${outfit.className} pt-10 lg:text-5xl text-2xl`}>
          Get the EZ Homesteading App
        </h2>
        <div>
          <div className={`${zilla.className} lg:text-xl mb-1`}>
            The user experience on the app is significantly better
          </div>
          <PWAInstall />
          <ul
            className={`${zilla.className} text-[.75rem] lg:text-lg list-disc lg:mx-8 my-5`}
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
          <div className="flex gap-x-2">
            <Card className="w-1/3 sheet shadow-md">
              <CardHeader
                className={`${outfit.className} text-7xl font-semibold`}
              >
                90%
              </CardHeader>
              <CardContent className={`${outfit.className} text-2xl`}>
                Browser Support
              </CardContent>
            </Card>
            <Card className="sheet w-full shadow-md">
              <CardHeader
                className={`${outfit.className} text-3xl font-semibold`}
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
          <h2 className={`${outfit.className} text-5xl`}>Installation Guide</h2>
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
      </div>
    </div>
  );
};

export default Page;
