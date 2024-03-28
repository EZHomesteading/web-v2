"use client";

import axios from "axios";
import { toast } from "react-hot-toast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Input from "../inputs/Input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

import { ModeToggle } from "../ui/mode-toggle";
import { UserInfo } from "@/next-auth";
import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { VscHistory } from "react-icons/vsc";
import { PiCookieThin } from "react-icons/pi";
import { GiSettingsKnobs } from "react-icons/gi";
import { MdFavoriteBorder } from "react-icons/md";
import { PiStorefrontThin } from "react-icons/pi";
import { FaOpencart } from "react-icons/fa";
import { HiOutlineDocument } from "react-icons/hi2";
import { CgCommunity } from "react-icons/cg";
import { Avatar } from "@/components/ui/avatar";
import LocationSearchInput from "../map/LocationSearchInput";

interface UserInfoProps {
  user?: UserInfo;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ElementType;
  current: boolean;
}

interface SecondaryNavigationItem {
  name: string;
  href: string;
  current: boolean;
}

const navigation: NavigationItem[] = [
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: GiSettingsKnobs,
    current: true,
  },
  {
    name: "Favorites",
    href: "/dashboard/favorites",
    icon: MdFavoriteBorder,
    current: false,
  },
  {
    name: "Current Orders",
    href: "/dashboard/reservations",
    icon: FaOpencart,
    current: false,
  },
  {
    name: "Store Settings",
    href: "/dashboard/my-store",
    icon: PiStorefrontThin,
    current: false,
  },
  {
    name: "Transaction History",
    href: "/dashboard/trips",
    icon: VscHistory,
    current: false,
  },
  {
    name: "Privacy Policy",
    href: "/privacy-policy",
    icon: MdOutlinePrivacyTip,
    current: false,
  },
  {
    name: "Terms of Service",
    href: "#",
    icon: HiOutlineDocument,
    current: false,
  },
  {
    name: "Cookies Policy",
    href: "/cookie-policy",
    icon: PiCookieThin,
    current: false,
  },
  {
    name: "Community Standards",
    href: "/community-standards",
    icon: CgCommunity,
    current: false,
  },
];

const secondaryNavigation: SecondaryNavigationItem[] = [
  { name: "Account", href: "#", current: true },
  { name: "Notifications", href: "#", current: false },
  { name: "Location & Region", href: "#", current: false },
  { name: "Teams", href: "#", current: false },
  { name: "Integrations", href: "#", current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const DashboardComp = ({ user }: UserInfoProps) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fullAddress, setFullAddress] = useState(
    `${user?.street}, ${user?.city}, ${user?.state}, ${user?.zip}`
  );
  type AddressComponents = {
    street: string;
    city: string;
    state: string;
    zip: string;
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      phoneNumber: user?.phoneNumber,
      email: user?.email,
      role: user?.role,
      name: user?.name,
    },
  });
  setValue("street", user?.street);
  setValue("city", user?.city);
  setValue("state", user?.state);
  setValue("zip", user?.zip);
  const getLatLngFromAddress = async (address: string) => {
    const apiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      if (response.data.status === "OK") {
        const { lat, lng } = response.data.results[0].geometry.location;
        return { lat, lng };
      } else {
        throw new Error("Geocoding failed");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  };
  // Function to handle form submission
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (
      fullAddress !== `${data.street}, ${data.city}, ${data.state}, ${data.zip}`
    ) {
      setFullAddress(
        `${data.street}, ${data.city}, ${data.state}, ${data.zip}`
      );
    }
    if (fullAddress !== "") {
      const geoData = await getLatLngFromAddress(fullAddress);
      setIsLoading(true);

      if (geoData) {
        const formData = {
          ...data,
          location: {
            type: "Point",
            coordinates: [geoData.lng, geoData.lat],
          },
        };
        axios
          .post("/api/update", data)
          .then(() => {
            toast.success("Your account details have changed");
          })
          .catch((error) => {
            toast.error(error);
          })
          .finally(() => {
            setIsLoading(false);
            return;
          });
      }
      // Send registration data to the backend
      axios
        .post("/api/update", data)
        .then(() => {
          toast.success("Your account details have changed");
        })
        .catch((error) => {
          toast.error(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const onDelete = () => {
    axios
      .delete(`/api/register/${user?.id}`)
      .then(() => {
        toast.success("Your account has been deleted");
      })
      .catch((error) => {
        toast.error(error?.response?.data?.error);
      })
      .finally(() => {
        location.replace("/");
      });
  };

  const handleAddressSelect = ({
    street,
    city,
    state,
    zip,
  }: AddressComponents) => {
    setValue("street", street);
    setValue("city", city);
    setValue("state", state);
    setValue("zip", zip);
  };
  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50 xl:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 ring-1 ring-white/10">
                    <div className="flex h-16 shrink-0 items-center"></div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => (
                              <li key={item.name}>
                                <a
                                  href={item.href}
                                  className={classNames(
                                    item.current
                                      ? "bg-gray-800"
                                      : "text-gray-400 hover:text-white hover:bg-gray-800",
                                    "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                  )}
                                >
                                  <item.icon
                                    className="h-6 w-6 shrink-0"
                                    aria-hidden="true"
                                  />
                                  {item.name}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </li>

                        <li className="-mx-6 mt-auto">
                          <a
                            href="#"
                            className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 hover:bg-gray-800"
                          >
                            <span className="sr-only">Your profile</span>
                            <span aria-hidden="true">Name goes here</span>
                          </a>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden xl:fixed xl:inset-y-0 xl:z-50 xl:flex xl:w-72 xl:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-black/10 px-6 ring-1 ring-white/5">
            <div className="flex h-16 shrink-0 items-center"></div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className={classNames(
                            item.current
                              ? "bg-gray-80"
                              : "text-gray-400 hover:text-white hover:bg-gray-800",
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                          )}
                        >
                          <item.icon
                            className="h-6 w-6 shrink-0"
                            aria-hidden="true"
                          />
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="xl:pl-72">
          {/* Sticky search header */}

          <main>
            <h1 className="sr-only">Account Settings</h1>

            <header className="border-b border-white/5">
              {/* Secondary navigation */}
              <nav className="flex overflow-x-auto py-4">
                <ul
                  role="list"
                  className="flex min-w-full flex-none gap-x-6 px-4 text-sm font-semibold leading-6 text-gray-400 sm:px-6 lg:px-8"
                >
                  {secondaryNavigation.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className={item.current ? "text-green-400" : ""}
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </header>

            {/* Settings forms */}
            <div className="divide-y divide-white/5">
              <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                <div>
                  <h2 className="text-base font-semibold leading-7">
                    Personal Information
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-400">
                    Use a permanent address where you can receive mail.
                  </p>
                </div>

                <form className="md:col-span-2">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                    <div className="col-span-full flex items-center gap-x-8">
                      <Avatar />
                      {/* THIS NEEDS UPDATED */}
                      <div>
                        <button
                          type="button"
                          className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold shadow-sm hover:bg-white/20"
                        >
                          Change Profile Picture
                        </button>
                        <p className="mt-2 text-xs leading-5 text-gray-400">
                          JPG, GIF or PNG. 1MB max.
                        </p>
                      </div>
                    </div>

                    <div className="col-span-full">
                      <div className="mt-2">
                        <div className="block w-full rounded-md border-0 bg-white/5 py-1.5 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6">
                          <Input
                            id="name"
                            label="Username"
                            disabled={isLoading}
                            register={register}
                            errors={errors}
                            isUsername={true}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-span-full">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium leading-6"
                      ></label>
                      <div className="mt-2">
                        <Input
                          id="email"
                          label="Email address"
                          disabled={isLoading}
                          register={register}
                          errors={errors}
                          isEmail={true}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-span-full">
                      <label
                        htmlFor="phoneNumber"
                        className="block text-sm font-medium leading-6"
                      ></label>
                      <div className="mt-2">
                        <Input
                          id="phoneNumber"
                          label="Phone Number"
                          disabled={isLoading}
                          register={register}
                          errors={errors}
                          isNumber={true}
                        />
                      </div>
                    </div>
                    <div className="col-span-full">
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium leading-6"
                      >
                        Current Address is: {user?.street}, {user?.city},{" "}
                        {user?.state}, {user?.zip}
                      </label>
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium leading-6"
                      >
                        To Change, Enter a new Address
                      </label>
                      <div className="mt-2">
                        <LocationSearchInput
                          address={watch("address")}
                          setAddress={(address) => setValue("address", address)}
                          onAddressParsed={handleAddressSelect}
                        />
                      </div>
                    </div>
                    <ModeToggle />
                    <div className="col-span-full">
                      <label
                        htmlFor="timezone"
                        className="block text-sm font-medium leading-6"
                      >
                        Timezone
                      </label>
                      <div className="mt-2">
                        <select
                          id="timezone"
                          name="timezone"
                          className="block w-full rounded-md border-0 bg-white/5 py-1.5 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6 [&_*]:text-black"
                        >
                          <option>Eastern Standard Time</option>
                          <option>Central Standard Time</option>
                          <option>Mountain Standard Time</option>
                          <option>Pacific Standard Time</option>
                          <option>Alaska Standard Time</option>
                          <option>Hawaii Standard Time</option>
                          <option>Greenwich Standard Time</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex">
                    <button
                      type="submit"
                      onClick={handleSubmit(onSubmit)}
                      className="rounded-md bg-green-700 px-3 py-2 text-sm font-semibold shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>

              <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                <div>
                  <h2 className="text-base font-semibold leading-7">
                    Change password
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-400">
                    Update your password associated with your account.
                  </p>
                </div>

                <form className="md:col-span-2">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                    <div className="col-span-full">
                      <Input
                        id="password"
                        label="New Password"
                        type="password"
                        disabled={isLoading}
                        register={register}
                        errors={errors}
                      />
                      <div className="mt-2">
                        <Input
                          id="confirmPassword"
                          label="Confirm New Password"
                          type="password"
                          disabled={isLoading}
                          register={register}
                          errors={errors}
                          validationRules={{
                            validate: (value) =>
                              value === watch("password") ||
                              "Passwords do not match",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex">
                    <button
                      type="submit"
                      className="rounded-md bg-green-700 px-3 py-2 text-sm font-semibold shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>

              <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                <div>
                  <h2 className="text-base font-semibold leading-7">
                    Log out other sessions
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-400">
                    Please enter your password to confirm you would like to log
                    out of your other sessions across all of your devices.
                  </p>
                </div>

                <form className="md:col-span-2">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                    <div className="col-span-full">
                      <Input
                        id="password"
                        label="Your Password"
                        type="password"
                        disabled={isLoading}
                        register={register}
                        errors={errors}
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex">
                    <button
                      type="submit"
                      className="rounded-md bg-green-700 px-3 py-2 text-sm font-semibold shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
                    >
                      Log out other sessions
                    </button>
                  </div>
                </form>
              </div>

              <div className="grid grid-cols-1 gap-x-8 gap-y-10 py-16 sm:px-6 md:grid-cols-3">
                <div>
                  <h2 className="text-base font-semibold leading-7">
                    Delete account
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-400">
                    No longer want to use EZHomesteading? You can delete your
                    account here. This action is not reversible. All information
                    related to this account will be deleted permanently
                    including listed products for Co-Ops and Producers.
                  </p>
                </div>

                <AlertDialog>
                  {/* Trigger Button */}
                  <AlertDialogTrigger asChild>
                    <Button className="rounded-md bg-red-500 text-sm font-semibold shadow-sm hover:bg-red-400">
                      Delete My Account
                    </Button>
                  </AlertDialogTrigger>

                  {/* Dialog Content */}
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <div className="text-white">
                        <AlertDialogTitle>Delete Account</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete your account? This
                          action is irreversible.
                        </AlertDialogDescription>
                      </div>
                    </AlertDialogHeader>
                    <AlertDialogCancel asChild>
                      <Button className="bg-gray-500 hover:bg-gray-600 ...">
                        Cancel
                      </Button>
                    </AlertDialogCancel>
                    <AlertDialogFooter>
                      {/* Confirm Deletion */}
                      <AlertDialogAction onClick={onDelete} asChild>
                        <Button className="bg-red-600 hover:bg-red-700">
                          Yes, Delete
                        </Button>
                      </AlertDialogAction>

                      {/* Cancel Button */}
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};
