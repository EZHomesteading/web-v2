import Link from "next/link";
import Image from "next/image";
import homebg from "@/public/images/home-images/ezhbg2.jpg";
import Search from "../components/navbar/Search";
import { Indie_Flower } from "next/font/google";
import FindListingsComponent from "@/app/components/find-listings";

const footerNavigation = {
  shop: [
    { name: "Vegetables", href: "/shop?category=Vegetables" },
    { name: "Fruits", href: "/shop?category=Fruits" },
    { name: "Dairy", href: "/shop?category=Dairy" },
    { name: "Grains", href: "/shop?category=Grains" },
    { name: "Seeds", href: "/shop?category=Seeds" },
  ],
  company: [
    { name: "Who we are", href: "/who-we-are" },
    { name: "How EZH Works", href: "/how-ezh-works" },
    { name: "Terms & Conditions", href: "/terms-and-conditions" },
    { name: "Privacy Policy", href: "/privacy-policy" },
  ],
  account: [
    { name: "Settings", href: "/dashboard" },
    { name: "Co-Ops I Follow", href: "/dashboard" },
    { name: "Messages", href: "/dashboard" },
  ],
  connect: [
    { name: "Contact Us", href: "/" },
    { name: "Facebook", href: "/" },
    { name: "Instagram", href: "/" },
    { name: "Pinterest", href: "/" },
  ],
};

const indie = Indie_Flower({
  weight: ["400"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

export default function Home() {
  return (
    <>
      <div className="relative h-screen flex justify-center items-center">
        <div className="w-full">
          <Image
            src={homebg}
            alt="Farmer Holding Basket of Vegetables"
            blurDataURL="data:..."
            placeholder="blur"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-900 opacity-60"></div>
        <div className="absolute text-start text-white">
          <h1 className="2xl:text-5xl text-sm font-bold tracking-tight Fresh mb-2">
            Fresh, Local, Organic
          </h1>
          <h1 className="2xl:text-7xl text-md font-bold tracking-tight Produce mb-2">
            <div className={indie.className}>Produce Made Simple</div>
          </h1>
          <p className="2xl:text-lg text-sm mb-2">
            EZ Homesteading connects family scale farmers & gardeners with
            people in their community.
          </p>
          <div className="w-2/5">
            <FindListingsComponent />
          </div>
        </div>
      </div>

      <footer aria-labelledby="footer-heading" className="bg-gray-500">
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-10 xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="grid grid-cols-2 gap-8 xl:col-span-2">
              <div className="space-y-12 md:grid md:grid-cols-2 md:gap-8 md:space-y-0">
                <div>
                  <h3 className="text-sm font-medium">Shop</h3>
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
                <div>
                  <h3 className="text-sm font-medium">Connect</h3>
                  <ul role="list" className="mt-6 space-y-6">
                    {footerNavigation.connect.map((item) => (
                      <li key={item.name} className="text-sm">
                        <Link href={item.href} className="">
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-12 md:mt-16 xl:mt-0">
              <h3 className="text-sm font-medium">
                Sign up for our newsletter
              </h3>
              <p className="mt-6 text-sm">
                Get updates on popular produce in your area and more.
              </p>
              <form className="mt-2 flex sm:max-w-md">
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  type="text"
                  autoComplete="email"
                  required
                  className="w-full min-w-0 appearance-none rounded-md border border-white px-4 py-2 text-base placeholder-gray-500 shadow-sm focus:border-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
                />
                <div className="ml-4 flex-shrink-0">
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  >
                    Sign up
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="border-t border-gray-800 py-10">
            <p className="text-sm">
              Copyright &copy; 2024 EZ Homesteading All Rights Reserved
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
