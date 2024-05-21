"use client";
import { Button } from "@/app/components/ui/button";
import { useCurrentUser } from "@/hooks/user/use-current-user";
import { Card, CardContent, CardFooter } from "@/app/components/ui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FieldValues, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import { UserRole } from "@prisma/client";
import Link from "next/link";
import { ExtendedHours } from "@/next-auth";
import { Sheet, SheetContent, SheetTrigger } from "@/app/components/ui/sheet";
import { DaySelect } from "@/app/components/co-op-hours/day-select";
import { HoursDisplay } from "@/app/components/co-op-hours/hours-display";
import CoopHoursSlider from "@/app/components/co-op-hours/co-op-hours-slider";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import Image from "next/image";
import { Outfit } from "next/font/google";
import { UploadButton } from "@/utils/uploadthing";
import { Textarea } from "@/app/components/ui/textarea";
import { IoStorefrontOutline } from "react-icons/io5";
import { GiFruitTree } from "react-icons/gi";
import { CiCircleInfo } from "react-icons/ci";
import homebg from "@/public/images/website-images/ezh-modal.jpg";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/app/components/ui/popover";
import { Input } from "@/app/components/ui/input";
import { XCircleIcon } from "@heroicons/react/20/solid";
import { PiTrashSimpleThin } from "react-icons/pi";

const outfit = Outfit({
  display: "swap",
  subsets: ["latin"],
});
const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const StoreSettings = () => {
  const user = useCurrentUser();
  let defaultHours;
  defaultHours = user?.hours || [
    {
      0: [{ open: 480, close: 1020 }],
      1: [{ open: 480, close: 1020 }],
      2: [{ open: 480, close: 1020 }],
      3: [{ open: 480, close: 1020 }],
      4: [{ open: 480, close: 1020 }],
      5: [{ open: 480, close: 1020 }],
      6: [{ open: 480, close: 1020 }],
    },
  ];

  const [coOpHours, setCoOpHours] = useState<ExtendedHours>(defaultHours);

  const [currentDayIndex, setCurrentDayIndex] = useState(0);

  const handleNextDay = () => {
    setCurrentDayIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % days.length;
      const nextDayHours = coOpHours[nextIndex]?.[0];

      if (nextDayHours === null) {
        setCoOpHours((prevHours) => ({
          ...prevHours,
          [nextIndex]: [defaultHours],
        }));
      }

      return nextIndex;
    });
  };

  const handlePrevDay = () => {
    setCurrentDayIndex((prevIndex) => {
      const newIndex = prevIndex === 0 ? 6 : prevIndex - 1;
      const prevDayHours = coOpHours[newIndex]?.[0];

      if (prevDayHours === null) {
        setCoOpHours((prevHours) => ({
          ...prevHours,
          [newIndex]: [{ open: 480, close: 1020 }],
        }));
      }
      return newIndex;
    });
  };
  const isOpen = coOpHours[currentDayIndex] !== null;

  const handleHourChange = (open: number, close: number) => {
    setCoOpHours((prevHours) => ({
      ...prevHours,
      [currentDayIndex]: [{ open, close }],
    }));
  };

  const handleApplyToAll = () => {
    const currentTimes = coOpHours[currentDayIndex];
    setCoOpHours((prevHours) => {
      const updatedHours: ExtendedHours = { ...prevHours };
      Object.keys(updatedHours).forEach((day) => {
        updatedHours[Number(day)] = currentTimes;
      });
      return updatedHours;
    });
  };

  const handleSpecificDays = (selectedDays: number[]) => {
    setCoOpHours((prevHours) => {
      const updatedHours: ExtendedHours = { ...prevHours };
      selectedDays.forEach((dayId) => {
        updatedHours[dayId] = coOpHours[currentDayIndex];
      });
      return updatedHours;
    });
  };
  const handleClose = () => {
    if (coOpHours[currentDayIndex] === null) {
      setCoOpHours((prevHours) => ({
        ...prevHours,
        [currentDayIndex]: [{ open: 480, close: 1020 }],
      }));
    } else {
      setCoOpHours((prevHours) => ({
        ...prevHours,
        [currentDayIndex]: null,
      }));
      handleNextDay();
    }
  };

  const currentDay = days[currentDayIndex];
  const [banner, setBanner] = useState(user?.banner || "");
  const [SODT, setSODT] = useState(user?.SODT || 0);
  const [bio, setBio] = useState(user?.bio);
  const currentDayHours = coOpHours[currentDayIndex]?.[0] || defaultHours;
  const router = useRouter();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const formData = {
      SODT: SODT,
      bio: bio,
      banner: banner,
      hours: coOpHours,
    };
    axios
      .post("/api/update", formData)
      .then(() => {
        router.replace("/dashboard/my-store");
        toast.success("Your account details have changed");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };
  const [newHours, setNewHours] = useState<{
    open: number;
    close: number;
    openDisplay: string;
    closeDisplay: string;
    openAmPm: string;
    closeAmPm: string;
  }>({
    open: 480,
    close: 1020,
    openDisplay: "",
    closeDisplay: "",
    openAmPm: "AM",
    closeAmPm: "PM",
  });

  const addNewHours = () => {
    const { open, close } = newHours;

    // Check if the new hours are valid
    if (open >= close) {
      toast.error("Open time must be before close time.");
      return;
    }

    const existingHours = coOpHours[currentDayIndex] || [];

    // Check for overlap with existing hours
    const overlapping = existingHours.some((hours) => {
      return (
        (open >= hours.open && open < hours.close) ||
        (close > hours.open && close <= hours.close)
      );
    });

    if (overlapping) {
      toast.error(
        "The new hours overlap with existing hours. Please try again."
      );
      return;
    }

    // Check for minimum time difference of 30 minutes with existing hours
    const tooClose = existingHours.some((hours) => {
      const minDiff = 30; // Minimum difference in minutes

      return (
        (open >= hours.close && open - hours.close < minDiff) ||
        (close <= hours.open && hours.open - close < minDiff)
      );
    });

    if (tooClose) {
      toast.error(
        "The new hours are too close to existing hours. There must be at least a 30-minute difference."
      );
      return;
    }

    setCoOpHours((prevHours) => ({
      ...prevHours,
      [currentDayIndex]: [...existingHours, { open, close }],
    }));

    setNewHours((prevHours) => ({
      ...prevHours,
      openDisplay: "",
      closeDisplay: "",
      openAmPm: "AM",
      closeAmPm: "PM",
    })); // Reset newHours state
  };
  if (user?.role === UserRole.CONSUMER) {
    return (
      <div className="p-6">
        <div>
          <div>Why is this page empty?</div>
          <div className="relative w-fit">
            <div className="relative hidden xl:block">
              <Image
                src={homebg}
                alt="Farmer Holding Basket of Vegetables"
                placeholder="blur"
                className="rounded-l-lg object-cover"
                fill
              />
            </div>
            <div className="mt-12 px-2">
              <div>
                <div className="text-black lg:text-2xl">
                  Would you like to become an EZH producer or co-op?
                </div>
                <div className="text-black text-xs">
                  You have to be a producer or co-op to add a product. There's
                  no registration fee and and can be done in a few seconds.
                </div>
              </div>

              <div className="mt-10 flex flex-col sm:flex-row gap-5">
                <Link
                  href="/info/ezh-roles"
                  className="flex flex-row items-center gap-x-2"
                >
                  <Button className="bg shadow-xl text-black">
                    <CiCircleInfo className="mr-2" />
                    More Info
                  </Button>
                </Link>

                <Link
                  href="/auth/become-a-co-op"
                  className="flex flex-row items-center text-black gap-x-2"
                >
                  <Button className="bg shadow-xl text-black">
                    <IoStorefrontOutline className="mr-2" />
                    Become a Co-op
                  </Button>
                </Link>

                <Link
                  href="/auth/become-a-producer"
                  className="flex flex-row items-center text-black gap-x-2"
                >
                  <Button className="bg shadow-xl text-black">
                    <GiFruitTree className="mr-2" />
                    Become a Producer
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else
    return (
      <div className="flex flex-col gap-y-8 px-2 lg:px-40 mb-8">
        <h1 className="sr-only">Store Settings</h1>
        <div className="w-full flex justify-between items-center mt-1">
          {user?.role === UserRole.COOP ? (
            <h2 className="text-base font-semibold leading-7">
              Co-op Store Settings
            </h2>
          ) : (
            <h2 className="text-base font-semibold leading-7">
              Producer Store Settings
            </h2>
          )}
          <Button onClick={onSubmit}>Update</Button>
        </div>
        <Card>
          <CardContent className="flex flex-col sheet  border-none shadow-lg w-full pt-2">
            {user?.role === UserRole.COOP ? (
              <h2 className="lg:text-3xl text-lg">Open & Close Hours</h2>
            ) : (
              <h2 className="lg:text-3xl text-lg">Delivery Hours</h2>
            )}

            <ul>
              {user?.role === UserRole.COOP ? (
                <li>
                  The hours when a producer can drop produce off and buyers can
                  pick up from your listing or co-op location.
                </li>
              ) : (
                <li>The hours you can deliver to a co-op.</li>
              )}
              <li>Please refresh after clicking update to see changes</li>
            </ul>
            <Card className="flex flex-col lg:flex-row  items-center bg-inherit border-none h-fit lg:h-[20vw] w-full justify-center">
              <div className="flex flex-col">
                <CardContent className="p-0 w-[90vw] sm:w-[70vw] lg:w-[50vw]">
                  <div className="flex justify-end"></div>
                  <CoopHoursSlider
                    day={currentDay}
                    hours={currentDayHours}
                    onChange={handleHourChange}
                    onNextDay={handleNextDay}
                    onPrevDay={handlePrevDay}
                  />
                  <CardFooter className="flex flex-col items-center justify-between gap-x-6 gap-y-2 mt-12 mb-0 p-0">
                    <Sheet>
                      {isOpen ? (
                        <>
                          {(coOpHours[currentDayIndex]?.length ?? 0) ===
                          0 ? null : (coOpHours[currentDayIndex]?.length ?? 0) <
                            3 ? (
                            <>
                              <div className="lg:w-[50%] flex flex-row w-[100%] lg:flex">
                                <Popover>
                                  <PopoverTrigger
                                    className={`${outfit.className} bg-slate-300 p-3 lg:w-[50%] w-full rounded-full text-black shadow-lg text-lg hover:bg-slate-500 hover:text-white`}
                                  >
                                    Add Hours
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className={`${outfit.className}`}
                                  >
                                    <div>
                                      <div className="text-xl font-semibold mb-2">
                                        Current Schedule
                                      </div>
                                      {coOpHours[currentDayIndex]?.map(
                                        (time, index) => (
                                          <div key={index} className="mb-2">
                                            {formatTimeDisplay(time)}
                                          </div>
                                        )
                                      )}
                                      <h2 className="text-lg font-semibold mb-2">
                                        Add New Hours
                                      </h2>
                                      <div className="flex flex-col gap-2 mb-4">
                                        <div className="flex gap-2">
                                          <Input
                                            type="text"
                                            name="open"
                                            value={newHours.openDisplay}
                                            onChange={(e) => {
                                              const inputValue = e.target.value;
                                              const formattedValue =
                                                formatTimeInput(inputValue);
                                              setNewHours((prevHours) => ({
                                                ...prevHours,
                                                openDisplay: formattedValue,
                                                open: parseTime(
                                                  `${formattedValue} ${newHours.openAmPm}`
                                                ),
                                              }));
                                            }}
                                            placeholder="Open Time"
                                            maxLength={8}
                                          />
                                          <Select
                                            value={newHours.openAmPm}
                                            onValueChange={(value) =>
                                              setNewHours((prevHours) => ({
                                                ...prevHours,
                                                openAmPm: value,
                                                open: parseTime(
                                                  `${newHours.openDisplay} ${value}`
                                                ),
                                              }))
                                            }
                                          >
                                            <SelectTrigger className="w-[80px]">
                                              <SelectValue placeholder="AM/PM" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="AM">
                                                AM
                                              </SelectItem>
                                              <SelectItem value="PM">
                                                PM
                                              </SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div className="flex gap-2">
                                          <Input
                                            type="text"
                                            name="close"
                                            value={newHours.closeDisplay}
                                            onChange={(e) => {
                                              const inputValue = e.target.value;
                                              const formattedValue =
                                                formatTimeInput(inputValue);
                                              setNewHours((prevHours) => ({
                                                ...prevHours,
                                                closeDisplay: formattedValue,
                                                close: parseTime(
                                                  `${formattedValue} ${newHours.closeAmPm}`
                                                ),
                                              }));
                                            }}
                                            placeholder="Close Time"
                                            maxLength={8}
                                          />
                                          <Select
                                            value={newHours.closeAmPm}
                                            onValueChange={(value) =>
                                              setNewHours((prevHours) => ({
                                                ...prevHours,
                                                closeAmPm: value,
                                                close: parseTime(
                                                  `${newHours.closeDisplay} ${value}`
                                                ),
                                              }))
                                            }
                                          >
                                            <SelectTrigger className="w-[80px]">
                                              <SelectValue placeholder="AM/PM" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="AM">
                                                AM
                                              </SelectItem>
                                              <SelectItem value="PM">
                                                PM
                                              </SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <Button onClick={addNewHours}>
                                          Add
                                        </Button>
                                      </div>
                                    </div>
                                  </PopoverContent>
                                </Popover>

                                <Popover>
                                  <PopoverTrigger
                                    className={`${outfit.className} bg-slate-300 p-3 lg:w-[50%] w-full rounded-full text-black shadow-lg text-lg hover:bg-slate-500 hover:text-white`}
                                  >
                                    Remove Hours
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className={`${outfit.className}`}
                                  >
                                    <div>
                                      <h2 className="text-lg font-semibold mb-2">
                                        Remove Hours
                                      </h2>
                                      {coOpHours[currentDayIndex]?.map(
                                        (time, index) => (
                                          <div
                                            key={index}
                                            className="flex items-center justify-between mb-2"
                                          >
                                            <span>
                                              {formatTimeDisplay(time)}
                                            </span>
                                            <div
                                              className="ml-2 text-red-500 hover:text-red-700"
                                              onClick={() => {
                                                const updatedHours = [
                                                  ...(coOpHours[
                                                    currentDayIndex
                                                  ] ?? []),
                                                ];
                                                updatedHours.splice(index, 1);
                                                setCoOpHours((prevHours) => ({
                                                  ...prevHours,
                                                  [currentDayIndex]:
                                                    updatedHours,
                                                }));
                                              }}
                                            >
                                              <span className="sr-only">
                                                Remove
                                              </span>
                                              <PiTrashSimpleThin />
                                            </div>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              </div>
                            </>
                          ) : (
                            <Popover>
                              <PopoverTrigger
                                className={`${outfit.className} bg-slate-300 p-3 lg:w-[50%] w-full rounded-full text-black shadow-lg text-lg hover:bg-slate-500 hover:text-white`}
                              >
                                Remove Hours from {currentDay}
                              </PopoverTrigger>
                              <PopoverContent className={`${outfit.className}`}>
                                <div>
                                  <h2 className="text-lg font-semibold mb-2">
                                    Remove Hours
                                  </h2>
                                  {coOpHours[currentDayIndex]?.map(
                                    (time, index) => (
                                      <div
                                        key={index}
                                        className="flex items-center justify-between mb-2"
                                      >
                                        <span>{formatTimeDisplay(time)}</span>
                                        <button
                                          className="ml-2 text-red-500 hover:text-red-700"
                                          onClick={() => {
                                            const updatedHours = [
                                              ...(coOpHours[currentDayIndex] ??
                                                []),
                                            ];
                                            updatedHours.splice(index, 1);
                                            setCoOpHours((prevHours) => ({
                                              ...prevHours,
                                              [currentDayIndex]: updatedHours,
                                            }));
                                          }}
                                        >
                                          <span className="sr-only">
                                            Remove
                                          </span>
                                          <PiTrashSimpleThin />
                                        </button>
                                      </div>
                                    )
                                  )}
                                </div>
                              </PopoverContent>
                            </Popover>
                          )}
                          <SheetTrigger
                            className={`${outfit.className} bg-slate-300 p-3 lg:w-[50%] w-full rounded-full text-black shadow-lg text-lg hover:bg-slate-500 hover:text-white`}
                          >
                            Apply This Schedule To Other Days
                          </SheetTrigger>
                          <SheetContent className="flex flex-col items-center justify-center border-none sheet h-screen w-screen">
                            <DaySelect
                              handleSpecificDays={handleSpecificDays}
                              handleApplyToAll={handleApplyToAll}
                              currentDayIndex={currentDayIndex}
                            />
                            <SheetTrigger
                              className={`${outfit.className} bg-slate-500 hover:bg-slate-600 p-2 rounded-full text-lg px-4`}
                            >
                              Apply Changes
                            </SheetTrigger>
                          </SheetContent>
                        </>
                      ) : null}
                      <Sheet>
                        <SheetTrigger
                          className={`${outfit.className} bg-slate-300 p-3 lg:w-[50%] w-full rounded-full text-black text-lg hover:bg-slate-500 shadow-xl hover:text-white`}
                        >
                          Visualize Your Current Schedule
                        </SheetTrigger>
                        <SheetContent className="flex flex-col items-center justify-center border-none sheet h-screen w-screen">
                          <HoursDisplay coOpHours={coOpHours} />
                        </SheetContent>
                        <div
                          onClick={handleClose}
                          className={`text-[.75rem] mb-1 ${
                            isOpen
                              ? "bg-red-300 p-3 hover:bg-red-500 lg:w-[50%] w-full rounded-full text-black shadow-lg text-lg text-center hover:cursor-pointer hover:text-white"
                              : "bg-emerald-300 text-black p-3 hover:bg-emerald-500 hover:text-white lg:w-[50%] w-full rounded-full  shadow-lg text-lg text-center hover:cursor-pointer"
                          }`}
                        >
                          {isOpen
                            ? `Close on ${currentDay}`
                            : `Reopen on ${currentDay}`}
                        </div>
                      </Sheet>
                    </Sheet>
                  </CardFooter>
                </CardContent>
              </div>
            </Card>

            <CardFooter className="flex justify-between m-0 p-0 pt-2">
              If you set hours to closed everyday, EZH users will not be able to
              buy from you.
            </CardFooter>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col sheet pt-2 border-none shadow-lg w-full">
            {user?.role === UserRole.COOP ? (
              <h2 className="lg:text-3xl text-lg">Set Out Time</h2>
            ) : (
              <h2 className="lg:text-3xl text-lg">Time to Begin Delivery</h2>
            )}
            <ul>
              {user?.role === UserRole.COOP ? (
                <li>
                  This is the amount of time it takes between you{" "}
                  <em>agreeing </em> to a pick up time and preparing the order.
                </li>
              ) : (
                <li>
                  This is the amount of time it takes between you{" "}
                  <em>agreeing to delivery time</em> and preparing it for
                  delivery.
                </li>
              )}
              <li>
                This is important to understand.{" "}
                <Link href="/info/sodt" className="text-blue-500">
                  More Info
                </Link>
              </li>
            </ul>
            <div className="justify-end flex">
              <label
                htmlFor="sodt"
                className="block text-sm font-medium leading-6"
              ></label>

              <Select
                onValueChange={(value) => setSODT(parseInt(value, 10))}
                value={SODT.toString()}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={user?.SODT || "Select a Time"} />
                </SelectTrigger>
                <SelectContent className={`${outfit.className} sheet`}>
                  <SelectGroup>
                    <SelectItem value="15">15 Minutes</SelectItem>
                    <SelectItem value="30">30 Minutes</SelectItem>
                    <SelectItem value="45">45 Minutes</SelectItem>
                    <SelectItem value="60">1 Hour</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <CardFooter className="flex justify-between m-0 p-0 pt-2">
              This is required for your role.
            </CardFooter>
          </CardContent>
        </Card>{" "}
        <Card>
          <CardContent className="flex flex-col sheet pt-2 border-none shadow-lg w-full">
            <h2 className="lg:text-3xl text-lg">Bio</h2>
            <ul>
              <li className="my-1">
                Basic description of you and your store. (200 characters max)
              </li>
            </ul>
            <div className="justify-center flex">
              <Textarea
                maxLength={200}
                value={bio ?? ""}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <CardFooter className="flex justify-between m-0 p-0 pt-2">
              A bio is recommended but not required
            </CardFooter>
          </CardContent>
        </Card>{" "}
        <Card>
          <CardContent className="flex flex-col sheet border-none shadow-lg w-full relative">
            <div className="m-0 p-0 pt-2">
              <div className="flex justify-between">
                <h1 className="text-lg lg:text-3xl">Store Banner Image</h1>
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res: any) => {
                    setBanner(res[0].url);
                  }}
                  onUploadError={(error: Error) => {
                    alert(`ERROR! ${error.message}`);
                  }}
                  appearance={{
                    container: "h-full w-max",
                  }}
                  className="ut-allowed-content:hidden ut-button:bg-white ut-button:text-black ut-button:w-fit ut-button:px-2 ut-button:h-full"
                  content={{
                    button({ ready }) {
                      if (ready) return <div>Upload a Banner</div>;
                      return "Getting ready...";
                    },
                  }}
                />
              </div>
              {!banner ? (
                <>You do not have a banner yet.</>
              ) : (
                <>
                  <ul>
                    <li>
                      This is your current store banner, which is visible on
                      your store
                    </li>
                    <li>Click update after upload finishes to see changes</li>
                  </ul>
                  <div className="w-full pt-2 flex justify-center">
                    <div
                      className="w-[90vw] sm:w-[70vw] lg:w-[50vw] relative"
                      style={{ aspectRatio: "8/1" }}
                    >
                      <Image
                        src={
                          user?.banner ||
                          "/images/website-images/banner-example.jpg"
                        }
                        alt="Banner"
                        fill
                        className="object-fit"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            <CardFooter className="m-0 p-0 pt-2">
              A store banner is optional but recommended.
            </CardFooter>
          </CardContent>
        </Card>
      </div>
    );
};

export default StoreSettings;
const formatTimeInput = (value: string) => {
  // Remove all non-digit characters except colon
  const sanitizedValue = value.replace(/[^0-9:]/g, "");
  const length = sanitizedValue.length;

  if (length === 0) {
    // Handle empty input
    return "";
  } else if (length === 1) {
    // Handle single-digit input
    const digit = parseInt(sanitizedValue, 10);
    if (digit >= 6) {
      return `0${digit}:`;
    }
    return sanitizedValue;
  } else if (length === 2) {
    // Handle two-digit input
    const hours = parseInt(sanitizedValue, 10);
    if (hours >= 1 && hours <= 12) {
      return `${hours}:`;
    }
    return `0${sanitizedValue[0]}:${sanitizedValue[1]}`;
  } else if (length === 3) {
    // Handle three-digit input
    if (sanitizedValue[2] === ":") {
      // Handle case when user deletes the colon
      return sanitizedValue.slice(0, 2);
    }
    const hours = parseInt(sanitizedValue.slice(0, 2), 10);
    if (hours >= 1 && hours <= 12) {
      return `${hours}:${sanitizedValue[2]}`;
    }
    return `0${sanitizedValue[0]}:${sanitizedValue.slice(1)}`;
  } else {
    // Handle input longer than three digits
    const [hours, minutes] = sanitizedValue.split(":");
    if (hours && minutes) {
      return `${hours.padStart(2, "0")}:${minutes.slice(0, 2)}`;
    }
    return sanitizedValue.slice(0, 5);
  }
};

const formatTimeDisplay = (time: { open: number; close: number }) => {
  const openHour = Math.floor(time.open / 60);
  const openMinute = time.open % 60;
  const closeHour = Math.floor(time.close / 60);
  const closeMinute = time.close % 60;

  const openAmPm = openHour >= 12 ? "PM" : "AM";
  const closeAmPm = closeHour >= 12 ? "PM" : "AM";

  const formattedOpenHour =
    openHour % 12 === 0 ? "12" : (openHour % 12).toString();
  const formattedCloseHour =
    closeHour % 12 === 0 ? "12" : (closeHour % 12).toString();

  const formattedOpenMinute = openMinute.toString().padStart(2, "0");
  const formattedCloseMinute = closeMinute.toString().padStart(2, "0");

  return `${formattedOpenHour}:${formattedOpenMinute} ${openAmPm} to ${formattedCloseHour}:${formattedCloseMinute} ${closeAmPm}`;
};

const parseTime = (value: string) => {
  const [time, ampm] = value.split(" ");
  const [hourString, minuteString] = time.split(":");

  let hour = parseInt(hourString, 10);
  const minute = parseInt(minuteString || "0", 10);

  if (ampm === "PM" && hour < 12) {
    hour += 12;
  } else if (ampm === "AM" && hour === 12) {
    hour = 0;
  }

  return isNaN(hour) || isNaN(minute) ? 0 : hour * 60 + minute;
};
