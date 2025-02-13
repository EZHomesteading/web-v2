"use client";
import Link from "next/link";
import Image from "next/image";
import homebg from "@/public/images/website-images/vegetables_bg.webp";
import homebg3 from "@/public/images/website-images/home-bg-3.jpg";
import homebg2 from "@/public/images/website-images/farmers-market-home.jpg";
import { OutfitFont } from "@/components/fonts";
import { PiArrowRightThin } from "react-icons/pi";
import { useRouter } from "next/navigation";
import AskZipModal from "./AskZipModal";
import { useState } from "react";
const footerNavigation = {
  shop: [
    { name: "More Info", href: "/info" },
    { name: "Contact Us", href: "/info/contact-us" },
  ],
  company: [
    { name: "Terms & Conditions", href: "/info/terms-and-conditions" },
    { name: "Privacy Policy", href: "/info/privacy-policy" },
  ],
  account: [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Settings", href: "/dashboard/account-settings/general" },
  ],
};

interface Props {
  user: any;
}
const Home = ({ user }: Props) => {
  const router = useRouter();
  const [isZipModalOpen, setIsZipModalOpen] = useState(false);

  const openAskZipModal = () => setIsZipModalOpen(true);

  const handleFindProduce = () => {
    if (!user || user.locations.length === 0) {
      openAskZipModal();
    } else {
      router.push(
        `/market?lat=${user.locations[0].coordinates[1]}&lng=${user.locations[0].coordinates[0]}&radius=20`
      );
    }
  };
  return (
    <>
      <main className="min-h-screen w-full gradient">
        <AskZipModal
          isOpen={isZipModalOpen}
          onClose={() => setIsZipModalOpen(false)}
        />
        <div
          className={`flex flex-col sm:flex-row px-2 items-center justify-evenly w-full pt-[30%] sm:pt-[10%]`}
        >
          <section className={`${OutfitFont.className}`}>
            <header className="!text-black">
              <div
                className={`${OutfitFont.className} text-green-600 text-2xl font-extrabold tracking-tight`}
              >
                {user && `Welcome, ${user.name}`}
              </div>
              <p className="text-lg 2xl:text-3xl font-medium text-black drop-shadow-md">
                Easily Find
              </p>

              <div className="flex flex-col sm:flex-row items-baseline sm:gap-2">
                {["Fresh", "Local", "Organic"].map((word, index) => (
                  <div key={word} className="flex items-baseline">
                    <span className="font-bold text-4xl md:text-6xl text-black drop-shadow-[0_2px_2px_rgba(0,0,0,.4)] tracking-wide">
                      {word}
                    </span>
                    {index < 2 && (
                      <span className="text-xl font-semibold text-black drop-shadow-lg">
                        ,{" "}
                      </span>
                    )}
                    {index === 2 && (
                      <span className="text-xl ml-1 text-black drop-shadow-lg">
                        with
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <h1
                className={`
                text-4xl sm:text-7xl 2xl:text-[5rem] 
                font-extrabold tracking-tight 
                text-black
                drop-shadow-[0_4px_4px_rgba(0,0,0,0.4)]
              `}
              >
                EZ Homesteading
              </h1>
            </header>

            <p className="text-md font-light  text-black mb-2 ml-1 max-w-2xl rounded">
              Find produce in your area. Join a community of EZH buyers, co-ops,
              & growers.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  handleFindProduce();
                }}
                className="
                  border 
                  border-white
                  bg-white/90
                  p-3 pr-10 rounded-full
                  font-medium
                  transition-all
                  shadow-xl hover:shadow-xl
                  text-sm sm:text-xl
                  relative
                  group
                "
              >
                Find Produce Nearby
                <PiArrowRightThin
                  className="absolute 
        right-3 
        top-1/2 
        text-black 
        transform 
        -translate-y-1/2 
        text-2xl
        duration-300
        group-hover:translate-x-2"
                />
              </button>
              <Link
                href={`${
                  !user
                    ? "/auth/register?callBackURL=/create-new-location"
                    : user.locations.length === 0
                    ? "/new-location-and-hours"
                    : "/create"
                }`}
                className="
                  border-none
                  bg-transparent
                  p-3 pr-10 rounded-full
                  font-medium
                  transition-all
                  text-sm sm:text-xl
                  relative
                  group
                "
              >
                Sell My Produce
                <PiArrowRightThin
                  className="absolute 
        right-3
        top-1/2 
        text-black 
        transform 
        -translate-y-1/2 
        text-2xl
        duration-300
        group-hover:translate-x-2"
                />
              </Link>
            </div>
          </section>
          <section
            className={`bg-white sm:w-[30rem] sm:h-[30rem] rounded-lg relative`}
          >
            <Image
              alt="Image"
              fill
              src={homebg}
              className="object-cover rounded-lg shadow-xl"
            />
          </section>
        </div>
        <div
          className={`flex flex-col sm:flex-row px-2 items-center justify-evenly w-full pt-[60%] sm:pt-[10%]`}
        >
          <section
            className={`bg-white sm:w-[30rem] sm:h-[30rem] rounded-lg relative`}
          >
            <Image
              alt="Image"
              fill
              src={homebg2}
              className="object-cover rounded-lg shadow-xl"
            />
          </section>
          <section className={`${OutfitFont.className}`}>
            <div
              id="h2"
              className="2xl:text-5xl text-sm font-bold tracking-tight mb-2 outfit"
            >
              Become an EZH Co-Op
              <ul className="2xl:text-lg text-sm font-medium mb-2">
                <li>A home-based opportunity to sell your produce</li>
                <li>
                  Set your own hours, determine your prices, and save on
                  farmer&apos;s market fees
                </li>
                <li>
                  Source from a passionate community of producers to diversify
                  your offerings
                </li>
              </ul>
            </div>
          </section>
        </div>
        <div
          className={`flex flex-col sm:flex-row px-2 items-center justify-evenly w-full pt-[30%] sm:pt-[10%] pb-40`}
        >
          <section className={`${OutfitFont.className}`}>
            <div
              id="h3"
              className="2xl:text-5xl text-sm font-bold tracking-tight"
            >
              <h1 className={OutfitFont.className}>Become an EZH Producer</h1>
              <ul className="2xl:text-lg text-sm font-medium mb-2">
                <li>Never let your homegrown produce go to waste again</li>
                <li>
                  Hassle-free transactions without direct consumer interaction
                </li>
              </ul>
            </div>
          </section>{" "}
          <section
            className={`bg-white sm:w-[30rem] sm:h-[30rem] rounded-lg relative`}
          >
            <Image
              alt="Image"
              fill
              src={homebg3}
              className="object-cover rounded-lg shadow-xl"
            />
          </section>
        </div>
      </main>
      <footer aria-labelledby="footer-heading" className="bg-gray-500">
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-10 xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="grid grid-cols-2 gap-8 xl:col-span-2">
              <div className="space-y-12 md:grid md:grid-cols-2 md:gap-8 md:space-y-0">
                <div>
                  <h3 className="text-sm font-medium">Support</h3>
                  <ul role="list" className="mt-6 space-y-6">
                    {footerNavigation.shop.map((item) => (
                      <li key={item.name} className="text-sm">
                        <Link href={item.href} className="">
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Company</h3>
                  <ul role="list" className="mt-6 space-y-6">
                    {footerNavigation.company.map((item) => (
                      <li key={item.name} className="text-sm">
                        <Link href={item.href} className="hover:text-white">
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="space-y-12 md:grid md:grid-cols-2 md:gap-8 md:space-y-0">
                <div>
                  <h3 className="text-sm font-medium">Account</h3>
                  <ul role="list" className="mt-6 space-y-6">
                    {footerNavigation.account.map((item) => (
                      <li key={item.name} className="text-sm">
                        <Link href={item.href} className=" hover:text-white">
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 py-10">
            <p className="text-sm">
              Copyright &copy; 2025 EZHomesteading All Rights Reserved
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};
export default Home;
