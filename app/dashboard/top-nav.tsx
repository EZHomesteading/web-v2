import Link from "next/link";

interface SecondaryNavigationItem {
  name: string;
  href: string;
  current: boolean;
}

const secondaryNavigation: SecondaryNavigationItem[] = [
  {
    name: "General",
    href: "/dashboard/account-settings/general",
    current: true,
  },
  {
    name: "Billing",
    href: "/dashboard/account-settings/billing",
    current: false,
  },
  {
    name: "Preferences",
    href: "/dashboard/account-settings/preferences",
    current: false,
  },
];

const TopNav = () => {
  return (
    <header className="border-b border-white/5">
      <nav className="flex overflow-x-auto py-4">
        <ul
          role="list"
          className="flex min-w-full flex-none gap-x-6 px-4 text-sm font-semibold leading-6 text-gray-400 sm:px-6 lg:px-8"
        >
          {secondaryNavigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={
                  item.current ? "text-green-900" : "hover:cursor-pointer"
                }
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default TopNav;
