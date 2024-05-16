"use client";
import { Button } from "@/app/components/ui/button";
import { useCurrentUser } from "@/hooks/user/use-current-user";
import { Card, CardContent, CardFooter } from "@/app/components/ui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import Input from "@/app/components/inputs/Input";
import { UserRole } from "@prisma/client";
import Link from "next/link";
import { ExtendedHours, UserInfo } from "@/next-auth";
import { CoOpHours } from "@/app/components/co-op-hours/co-op-hours";
import { Sheet, SheetContent, SheetTrigger } from "@/app/components/ui/sheet";
import { DaySelect } from "@/app/components/co-op-hours/day-select";
import { HoursDisplay } from "@/app/components/co-op-hours/hours-display";
import CoopHoursSlider from "@/app/components/co-op-hours/co-op-hours-slider";
import Image from "next/image";
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
  if (user?.hours) {
    defaultHours = user?.hours;
  } else {
    defaultHours = {
      0: [{ open: 480, close: 1020 }],
      1: [{ open: 480, close: 1020 }],
      2: [{ open: 480, close: 1020 }],
      3: [{ open: 480, close: 1020 }],
      4: [{ open: 480, close: 1020 }],
      5: [{ open: 480, close: 1020 }],
      6: [{ open: 480, close: 1020 }],
    };
  }
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
      } else {
        setCoOpHours((prevHours) => ({
          ...prevHours,
          [nextIndex]: null,
        }));
      }

      return nextIndex;
    });
  };

  const handlePrevDay = () => {
    if (currentDayIndex == 0) {
      setCurrentDayIndex(6);
    } else {
      setCurrentDayIndex((prevIndex) => (prevIndex - 1) % days.length);
    }
  };

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

  const handleSpecificDays = () => {
    const currentTimes = coOpHours[currentDayIndex];
  };

  const handleClose = () => {
    setCoOpHours((prevHours) => ({
      ...prevHours,
      [currentDayIndex]: null,
    }));
    handleNextDay();
  };
  const currentDay = days[currentDayIndex];

  const currentDayHours = coOpHours[currentDayIndex]?.[0] || defaultHours;
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      SODT: user?.SODT,
      banner: user?.banner,
      hours: user?.hours,
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const formData = {
      ...data,
    };
    axios
      .post("/api/update", formData)
      .then(() => {
        router.refresh();
        toast.success("Your account details have changed");
      })
      .catch((error) => {
        toast.error(error);
      })
      .finally(() => {
        setIsLoading(false);

        return;
      });
  };

  const handleImageChange = (value: string) => {
    setValue("banner", value);
  };

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
        <Button>Update</Button>
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
          </ul>
          <Card className="flex flex-col lg:flex-row  items-center bg-inherit border-none h-fit lg:h-[20vw] w-full justify-center">
            <div className="flex flex-col items-center">
              <CardContent className="p-0 w-[90vw] sm:w-[70vw] lg:w-[50vw]">
                <div className="flex justify-end">
                  <Button
                    onClick={handleClose}
                    className="bg-red-900 text-[.75rem] mb-1"
                  >
                    Close on {currentDay}
                  </Button>
                </div>
                <CoopHoursSlider
                  day={currentDay}
                  hours={currentDayHours}
                  onChange={handleHourChange}
                  onNextDay={handleNextDay}
                  onPrevDay={handlePrevDay}
                />
                <CardFooter className="flex flex-col md:flex-row items-end justify-between gap-x-6 gap-y-2 mt-12 mb-0 p-0">
                  <Sheet>
                    <SheetTrigger className="w-full lg:w-1/2 text-xs bg-slate-600 text-white p-2 lg:mt-4 rounded-full">
                      Apply This Schedule To
                    </SheetTrigger>
                    <SheetContent className="flex flex-col items-center justify-center border-none sheet h-screen w-screen">
                      <DaySelect />
                    </SheetContent>
                  </Sheet>

                  <Sheet>
                    <SheetTrigger className="w-full lg:w-1/2 text-xs bg-slate-600 text-white p-2 rounded-full lg:mt-4">
                      Visualize Your Current Schedule
                    </SheetTrigger>
                    <SheetContent className="flex flex-col items-center justify-center border-none sheet h-screen w-screen">
                      <HoursDisplay coOpHours={coOpHours} />
                    </SheetContent>
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
                This is the amount of time it takes between you getting an order
                and preparing it.
              </li>
            ) : (
              <li>
                This is the amount of time it takes between you getting an order
                and preparing it for delivery
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
            {user?.role === UserRole.COOP ? (
              <Input
                id="SODT"
                label="Set Out Time"
                disabled={isLoading}
                register={register}
                errors={errors}
                isEmail={true}
                required
              />
            ) : (
              <Input
                id="SODT"
                label="Time to Begin Delivery"
                disabled={isLoading}
                register={register}
                errors={errors}
                isEmail={true}
                required
              />
            )}
          </div>

          <CardFooter className="flex justify-between m-0 p-0 pt-2">
            This is required for your role.
          </CardFooter>
        </CardContent>
      </Card>{" "}
      <Card>
        <CardContent className="flex flex-col sheet border-none shadow-lg w-full relative">
          <div className="m-0 p-0 pt-2">
            <h1 className="text-lg lg:text-3xl">Store Banner Image</h1>

            {!user?.banner ? (
              <></>
            ) : (
              <>
                <ul>
                  <li>
                    This is your current store banner, which is visible on your
                    store
                  </li>
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
