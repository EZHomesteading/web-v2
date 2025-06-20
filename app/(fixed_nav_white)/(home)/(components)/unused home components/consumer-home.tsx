//homepage displayed if user role is CONSUMER or none.
import Link from "next/link";
import FindListingsComponent from "@/components/listings/search-listings";
// import Image from "next/image";
// import homebg from "@/public/images/website-images/fall-harvest-vegetable-market.webp";
// import consumer from "@/public/images/website-images/ezhconsumer.webp";
// import producer from "@/public/images/website-images/ezhproducer.webp";
import Image from "next/image";
import homebg from "@/public/images/website-images/ezh-bg5.jpg";
import { UserInfo } from "next-auth";
import { OutfitFont } from "@/components/fonts";
interface Props {
  user: UserInfo;
}

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

export default function Home({ user }: Props) {
  const apiKey = process.env.MAPS_KEY;
  return (
    <>
      <div className="bg-black text-white w-full ">
        <div className="absolute inset-0 ">
          <Image
            src={homebg}
            alt="Home Page"
            fill
            className="object-cover 2xl:object-fit"
            sizes="100vw"
          />{" "}
          <div className="absolute inset-0 bg-black bg-opacity-10 "></div>
        </div>
        <div className="h-screen z-[3] px-2 py-2 pt-20 flex flex-col items-center   sm:items-center">
          <header className="py-12 z-[3]">
            <div className="flex flex-col">
              <div
                className={`${OutfitFont.className} text-green-600 text-[3rem] sm:text-[4rem] 2xl:text-[5rem] font-extrabold tracking-tight`}
              >
                Welcome {user.name}
              </div>
              <div className={` 2xl:text-3xl text-lg font-light `}>
                Easily Find eeee
              </div>
              <div className="flex flex-col sm:flex-row">
                <div>
                  <span className="text-green-200 tracking font-medium text-5xl md:text-6xl">
                    Fresh
                  </span>
                  <span className="text-xl mr-2 font-semibold">, </span>
                </div>
                <div>
                  <span className="text-green-300 font-bold text-5xl md:text-6xl">
                    Local
                  </span>
                  <span className="text-xl mr-2">
                    ,{""} &{""}
                  </span>
                </div>
                <div>
                  <span className="text-green-400 text-5xl md:text-6xl font-semibold">
                    Organic
                  </span>{" "}
                  <span className="text-xl ml-1 tracking-wide">with </span>
                </div>
              </div>
              <h2 className="2xl:text-5xl text-4xl font-bold tracking-tight outfit">
                <div
                  className={`${OutfitFont.className} text-green-600 sm:text-7xl 2xl:text-[5rem] font-extrabold tracking-tight`}
                >
                  EZ Homesteading
                </div>
              </h2>
            </div>
            <p className="text-lg text-[.5rem] mb-2 text-extralight">
              Find produce in your area. Join a community of EZH consumers,
              co-ops, & producers.
            </p>
            <div className="flex">
              {apiKey && <FindListingsComponent apiKey={apiKey} />}
            </div>
          </header>
        </div>

        {/* <section className="flex flex-col items-stary justify-start text-start px-4">
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
        {/* </div> */}
        {/* </Link> */}
        {/* </section> */}
      </div>
      <footer aria-labelledby="footer-heading" className="bg-gray-500 z-[3]">
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
              Copyright &copy; 2024 EZ Homesteading All Rights Reserved
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
