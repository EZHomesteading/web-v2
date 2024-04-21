import Link from "next/link";
import Image from "next/image";
import { Outfit } from "next/font/google";
import FindListingsComponent from "@/app/components/listings/search-listings";
import homebg from "@/public/images/website-images/fall-harvest-vegetable-market.webp";
import consumer from "@/public/images/website-images/ezhconsumer.webp";
import producer from "@/public/images/website-images/ezhproducer.webp";

const footerNavigation = {
  shop: [
    { name: "Vegetables", href: "/shop?q=vegetables" },
    { name: "Fruits", href: "/shop?q=fruits" },
    { name: "Dairy", href: "/shop?q=dairy" },
    { name: "Grains", href: "/shop?q=grains" },
    { name: "Seeds", href: "/shop?q=seeds" },
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

const outfit = Outfit({
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

export default function Home() {
  return (
    <>
      <div className="bg-black text-white w-full">
        <div className="h-screen px-2 py-2 flex flex-col justify-center lg:p-0 lg:flex-row lg:justify-evenly sm:items-center">
          <header className="py-12">
            <h1 className="2xl:text-5xl text-lg font-bold tracking-tight f">
              <div
                className={`${outfit.className} 2xl:text-4xl text-md font-light`}
              >
                Easily Find
              </div>
              <div className={`${outfit.className} `}>
                <em>
                  <span className="text-green-200 tracking font-medium">
                    Fresh
                  </span>
                  <span className="text-xl mr-2 font-semibold">, {""}</span>
                  <span className="text-green-400 font-bold">Local</span>
                  <span className="text-xl mr-2 tracking-widest">
                    ,{""} &{""}
                  </span>
                  <span className="text-green-600">Organic</span>{" "}
                  <span className="text-xl mr-2 tracking-wide">with{""}</span>
                </em>
              </div>
            </h1>
            <h2 className="2xl:text-5xl text-2xl font-bold tracking-tight mb-2 outfit">
              <div
                className={`${outfit.className} text-green-900 2xl:text-6xl text-2xl font-extrabold tracking-tight`}
              >
                EZ Homesteading
              </div>
            </h2>
            <p className="2xl:text-lg text-xs mb-2">
              Find local produce in your area. Join a community of EZH
              consumers, co-ops, & producers.
            </p>
            <div className="flex">
              <FindListingsComponent />
            </div>
          </header>
          <div>
            {" "}
            {/* <Image
              src={homebg}
              alt="Farmer Holding Basket of Vegetables"
              priority={true}
              blurDataURL="data:..."
              placeholder="blur"
              fill
              className="object-cover rounded-3xl"
            /> */}
          </div>
        </div>

        <section className="px-2">
          <div
            id="h2"
            className="2xl:text-5xl text-sm font-bold tracking-tight mb-2 outfit"
          >
            Become an EZH Co-Op
            <ul className="2xl:text-lg text-sm mb-2">
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
          <div className="aspect-square w-full relative overflow-hidden rounded-xl">
            {/* <Image
              src={consumer}
              alt="Farmer Holding Basket of Vegetables"
              placeholder="blur"
              priority
              fill
              className="object-cover h-full w-full group-hover:scale-110 transition"
            /> */}
          </div>
        </section>

        <section className="px-2">
          <div
            id="h3"
            className="2xl:text-5xl text-sm font-bold tracking-tight"
          >
            <h1 className={outfit.className}>Become an EZH Producer</h1>
            <ul className="2xl:text-lg text-sm mb-2">
              <li>Never let your homegrown produce go to waste again</li>
              <li>
                Hassle-free transactions without direct consumer interaction
              </li>
            </ul>
          </div>
          <Link href="/auth/become-a-producer">
            <div className="w-[80vw] h-[20vh] lg:w-[30vw] md:h-[30vh]">
              {/* <Image
                src={producer}
                alt="Farmer Holding Basket of Vegetables"
                blurDataURL="data:..."
                placeholder="blur"
                width={400}
                height={400}
                className="object-cover rounded-lg"
              /> */}
            </div>
          </Link>
        </section>
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
