import Link from "next/link";
import Image from "next/image";
import homebg from "../public/images/home-images/ezh-home-static-bg.jpg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./components/ui/carousel";
import Search from "./components/navbar/Search";

const collections = [
  {
    imageSrc: "/images/how-ezh-works/how-ezh-works-1.jpg",
    imageAlt: "",
    description:
      "This is Edward. He is a hard-working electritian, but ever since he was a child he has loved growing tomatoes. But he always has too many at the end of a harvest for just himself!",
  },
  {
    imageSrc: "/images/how-ezh-works/how-ezh-works-2.jpg",
    imageAlt: "",
    description:
      "Instead of letting those fresh organic tomatoes go to waste, Edward uses EZ Homesteading to list hs excess tomatoes for sale.",
  },
  {
    imageSrc: "/images/how-ezh-works/how-ezh-works-3.jpg",
    imageAlt: "",
    description:
      "Edward puts his tomatoes that he has sold on EZ Homesteading out for his consumers to come by and pick up.",
  },
  {
    imageSrc: "/images/how-ezh-works/how-ezh-works-4.jpg",
    imageAlt: "",
    description:
      "This is Bella, she is having a dinner party soon and would love some truly organic fresh tomatoes, but doesnt have the time to grow them herself. So she goes on EZ Homesteading and discovers Edwards Co-Op is right around the corner!",
  },
  {
    imageSrc: "/images/how-ezh-works/how-ezh-works-5.jpg",
    imageAlt: "",
    description:
      "Edward and Bella agree on a price, and Bella swings by Edwards Co-Op on the way home from work! They never have to see eachother or exchange cash if they do not want to.",
  },
  {
    imageSrc: "/images/how-ezh-works/how-ezh-works-6.jpg",
    imageAlt: "",
    description:
      "Both Edward and Bella are thrilled! Edward made money instead of letting his excess tomatoes go to waste. And Bella got truly fresh organic tomatoes grown by a gardener who cares about how his produce is grown.",
  },
];

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

export default function Home() {
  return (
    <>
      <div className="relative h-screen flex justify-center items-center">
        <div className="h-3/4 w-full">
          <Image
            src={homebg}
            alt="Farmer Holding Basket of Vegetables"
            blurDataURL="data:..."
            placeholder="blur"
            fill
            className="object-cover w-full h-full"
          />
        </div>
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-900 opacity-50"></div>
        <div className="absolute text-start text-white">
          <h1 className="text-3xl font-bold tracking-tight Fresh mb-2">
            Fresh, Local, Organic
          </h1>
          <h1 className="text-4xl font-bold tracking-tight Produce mb-2">
            Produce Made Simple
          </h1>
          <p className="text-xl mb-2">
            EZ Homesteading connects family scale farmers & gardeners with
            people in their community.
          </p>
          <div className="w-2/5">
            <Search />
          </div>
        </div>
      </div>

      <main>
        {/* Featured section */}
        <section
          aria-labelledby="social-impact-heading"
          className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 sm:pt-32 lg:px-8"
        >
          <div className="relative overflow-hidden rounded-xl">
            <div className="absolute inset-0">
              <button>
                <Image
                  src="/images/home-images/become-a-co-op.jpg"
                  alt="Become a Co-Op on EZHomesteading"
                  className="h-full w-full object-cover object-center"
                  fill
                />
              </button>
            </div>
            <div className="relative bg-gray-900 bg-opacity-75 px-6 py-32 sm:px-12 sm:py-40 lg:px-16 text-white">
              <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
                <h2
                  id="social-impact-heading"
                  className="text-3xl font-bold tracking-tight sm:text-4xl"
                >
                  <span className="block sm:inline">Become a Co-Op</span>
                </h2>
                <p className="mt-3 text-xl">
                  Grow or source, and then start selling. No monthly subscrition
                  or hidden fees.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="collection-heading"
          className="mx-auto sm:px-6 sm:pt-32 lg:max-w-7xl lg:px-8"
        >
          <h2
            id="collection-heading"
            className="text-2xl font-bold tracking-tight"
          >
            How EZH Works
          </h2>
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full mb-3"
          >
            <CarouselContent>
              {collections.map((collection) => (
                <CarouselItem
                  key={collection.imageSrc}
                  className="md:basis-1/2 lg:basis-1/3"
                >
                  <Image
                    src={collection.imageSrc}
                    alt={collection.imageAlt}
                    height={500}
                    width={500}
                    className="rounded-lg"
                  />
                  <span>
                    <p>{collection.description}</p>
                  </span>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>
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
