"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

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
    name: "Notifications",
    href: "/dashboard/account-settings/notification-preferences",
    current: false,
  },
];

const TopNav = () => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <header className="border-b border-white/5 mt-0 lg:mt-6">
      <nav className="flex overflow-x-auto py-4">
        <ul
          role="list"
          className="flex min-w-full flex-none gap-x-6 px-4 text-sm font-semibold leading-6 text-gray-400 sm:px-6 lg:px-8"
        >
          {secondaryNavigation.map((item) => (
            <li key={item.name}>
              <div
                onClick={() => router.push(item.href)}
                className={
                  pathname === item.href
                    ? "text-green-900"
                    : "hover:cursor-pointer"
                }
              >
                {item.name}
              </div>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default TopNav;
