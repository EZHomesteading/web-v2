import React, { useCallback, useEffect, useState, useRef } from "react";
import { Hours } from "@prisma/client";
import WeelkyScheduleChart from "../weekly-schedule-chart";
import { Button } from "@/components/ui/button";
import { OutfitFont } from "@/components/fonts";
import { LocationObj } from "location-types";
import OnboardContainer from "../onboard.container";
import { Clock } from "lucide-react";
import AvailabilityScore from "@/app/(nav_market_layout)/market/(components)/availabilityScore";

interface StepSevenProps {
  location?: LocationObj;
  formData: string[] | undefined;
  updateFormData: (
    newData: Partial<{ selectedMonths: number[]; hours: Hours }>
  ) => void;
  resetHoursData: (
    hours: Hours,
    newType: "both" | "delivery" | "pickup"
  ) => void;
  selectedMonths: number[] | undefined;
  onDayChange: (selectedDays: string[]) => void;
  onFinish: (hours: Hours, type: string) => void;
  fulfillmentStyle?: string;
}
interface TimeSlot {
  open: number; // Hour in 24-hour format
  close: number; // Hour in 24-hour format
}

interface DayHours {
  date: string;
  timeSlots: TimeSlot[];
  capacity: number;
}

interface LocationHours {
  [key: string]: DayHours[] | undefined;
  pickup?: DayHours[];
  delivery?: DayHours[];
}

interface ScoreResult {
  pickup: {
    workingmanScore: number;
    retireeScore: number;
    combinedScore: number;
  };
  delivery: {
    workingmanScore: number;
    retireeScore: number;
    combinedScore: number;
  };
}

const StepEight: React.FC<StepSevenProps> = ({
  location,
  formData,
  updateFormData,
  selectedMonths,
  onDayChange,
  onFinish,
  fulfillmentStyle,
  resetHoursData,
}) => {
  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const [openMonths, setOpenMonths] = useState<number[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  useEffect(() => {
    if (selectedMonths && selectedMonths.length > 0) {
      setOpenMonths(selectedMonths);
    }
  }, [selectedMonths]);

  const toggleMonth = useCallback((monthIndex: number) => {
    setOpenMonths((prevMonths) => {
      const newMonths = prevMonths.includes(monthIndex)
        ? prevMonths.filter((m) => m !== monthIndex)
        : [...prevMonths, monthIndex];
      return newMonths;
    });
  }, []);

  const handleMouseDown = (monthIndex: number) => {
    setIsDragging(true);
    toggleMonth(monthIndex);
  };

  const handleMouseEnter = (monthIndex: number) => {
    if (isDragging) {
      toggleMonth(monthIndex);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    updateFormData({
      selectedMonths: openMonths,
    });
  }, [openMonths, updateFormData]);

  const handleDayClick = (day: string) => {
    onDayChange([day]);
  };

  const generateHoursData = useCallback(
    (type: string) => {
      if (!selectedMonths || !location?.hours) {
        console.error("Missing required data for generating hours");
        return null;
      }

      const hours: Hours = {
        delivery: [],
        pickup: [],
      };

      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();

      selectedMonths.forEach((monthIndex) => {
        // Determine which year to use for this month
        const monthToProcess = new Date(currentYear, monthIndex, 1);
        const useNextYear = monthToProcess < currentDate;
        const yearToUse = useNextYear ? currentYear + 1 : currentYear;

        const daysInMonth = new Date(yearToUse, monthIndex + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
          const dateToCheck = new Date(yearToUse, monthIndex, day);
          const currentDayDate = new Date(currentYear, monthIndex, day);

          // For current month, add both current and next year schedules for remaining days
          if (monthIndex === currentDate.getMonth()) {
            if (currentDayDate < currentDate) {
              // Past days in current month - only add next year
              addScheduleForDate(new Date(currentYear + 1, monthIndex, day));
            } else {
              // Remaining days in current month - add both years
              addScheduleForDate(new Date(currentYear, monthIndex, day));
              addScheduleForDate(new Date(currentYear + 1, monthIndex, day));
            }
          } else if (useNextYear) {
            // Past months - only add next year
            addScheduleForDate(dateToCheck);
          } else {
            // Future months - only add current year
            addScheduleForDate(dateToCheck);
          }
        }
      });

      // Helper function to add schedule for a specific date
      function addScheduleForDate(date: Date) {
        const dayOfWeek = date.getDay();
        const schedules = location?.hours?.pickup || [];
        const daySchedule = schedules.find(
          (schedule: {
            date: {
              toLocaleString: (
                arg0: string,
                arg1: { weekday: string }
              ) => string;
            };
          }) =>
            weekDays[dayOfWeek] ===
            schedule.date.toLocaleString("en-US", { weekday: "long" })
        );

        if (daySchedule && daySchedule.timeSlots.length > 0) {
          const timeSlots = daySchedule.timeSlots.map(
            (slot: { open: any; close: any }) => ({
              open: slot.open,
              close: slot.close,
            })
          );

          const dailySchedule = {
            date,
            timeSlots,
            capacity: 0,
          };

          if (type === "delivery") {
            hours.delivery.push(dailySchedule);
          } else if (type === "pickup") {
            hours.pickup.push(dailySchedule);
          } else if (type === "both") {
            hours.pickup.push(dailySchedule);
            hours.delivery.push(dailySchedule);
          }
        }
      }

      // Sort the arrays by date to ensure chronological order
      hours.delivery.sort((a, b) => a.date.getTime() - b.date.getTime());
      hours.pickup.sort((a, b) => a.date.getTime() - b.date.getTime());

      return hours;
    },
    [selectedMonths, location?.hours, weekDays, fulfillmentStyle]
  );
  const handleFinish = () => {
    const hoursData = generateHoursData(fulfillmentStyle ?? "pickup");
    if (hoursData) {
      onFinish(hoursData, fulfillmentStyle ?? "pickup");
    }
  };

  const handleFinishBoth = (type: "both" | "delivery" | "pickup") => {
    const hoursData = generateHoursData(type);
    if (hoursData) {
      if (type === "both") {
        updateFormData({
          selectedMonths,
          hours: hoursData,
        });
        onFinish(hoursData, type);
      } else {
        updateFormData({ selectedMonths, hours: hoursData });
        resetHoursData(hoursData, type);
      }
    }
  };
  function calculateAvailabilityScores(
    hours: LocationHours | null | undefined
  ): ScoreResult {
    if (!hours) {
      return {
        pickup: { workingmanScore: 1, retireeScore: 1, combinedScore: 1 },
        delivery: { workingmanScore: 1, retireeScore: 1, combinedScore: 1 },
      };
    }

    return {
      pickup: calculateServiceScores(hours.pickup || []),
      delivery: calculateServiceScores(hours.delivery || []),
    };
  }
  function calculateServiceScores(hours: DayHours[]) {
    const today = new Date();
    const next7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      return date.toISOString().split("T")[0];
    });

    const relevantHours = hours.filter((hour) => {
      const hourDate = new Date(hour.date).toISOString().split("T")[0];
      return next7Days.includes(hourDate);
    });

    let workingmanScore = 0;
    let retireeScore = 0;

    next7Days.forEach((date) => {
      const dayHours = relevantHours.find(
        (h) => new Date(h.date).toISOString().split("T")[0] === date
      );

      if (!dayHours) return;

      const dayOfWeek = new Date(date).getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isSunday = dayOfWeek === 0;

      if (!dayHours.timeSlots || dayHours.timeSlots.length === 0) return;

      const workingCoverage = calculateTimeSlotCoverage(
        dayHours.timeSlots,
        960,
        1200
      );

      const retireeCoverage = calculateTimeSlotCoverage(
        dayHours.timeSlots,
        600,
        1200
      );

      const weekendModifier = isWeekend ? (isSunday ? 0.3 : 0.1) : 1;

      workingmanScore += workingCoverage * weekendModifier;
      retireeScore += retireeCoverage * weekendModifier;
    });

    const normalizeScore = (score: number): number => {
      const maxPossibleScore = 7;
      const normalized = (score / maxPossibleScore) * 4;
      return Math.max(1, Math.min(3, Math.ceil(normalized)));
    };

    const finalWorkingmanScore = normalizeScore(workingmanScore);
    const finalRetireeScore = normalizeScore(retireeScore);

    const combinedScore = Math.ceil(
      (finalWorkingmanScore + finalRetireeScore) / 2
    );

    return {
      workingmanScore: finalWorkingmanScore,
      retireeScore: finalRetireeScore,
      combinedScore,
    };
  }
  function calculateTimeSlotCoverage(
    timeSlots: TimeSlot[],
    targetStart: number,
    targetEnd: number
  ): number {
    let totalCoverage = 0;
    const targetHours = targetEnd - targetStart;

    timeSlots.forEach((slot) => {
      const overlapStart = Math.max(slot.open, targetStart);
      const overlapEnd = Math.min(slot.close, targetEnd);
      if (overlapEnd > overlapStart) {
        totalCoverage += (overlapEnd - overlapStart) / targetHours;
      }
    });

    return Math.min(1, totalCoverage);
  }

  const scores = calculateAvailabilityScores(location?.hours);

  const getColor = (score: number) => {
    switch (score) {
      case 3:
        return "text-green-500";
      case 2:
        return "text-yellow-500";
      case 1:
        return "text-red-500";
      default:
        return "text-gray-300";
    }
  };
  const pickupScore = scores["pickup"].combinedScore;
  const deliveryScore = scores["delivery"].combinedScore;
  const pickupColor = getColor(scores["pickup"].combinedScore);
  const deliveryColor = getColor(scores["delivery"].combinedScore);
  // const renderButton = () => {
  //   const getButtonConfig = () => {
  //     switch (fulfillmentStyle) {
  //       case "both":
  //         return {
  //           onClick: () => handleFinish("both"),
  //           text: "Save Hours",
  //         };
  //       case "bothone":
  //         return {
  //           onClick: () => handleFinish("delivery"),
  //           text: "Save Delivery & Set Pickup hours",
  //         };
  //       default:
  //         return {
  //           onClick: () => handleFinish(),
  //           text: "Save Hours",
  //         };
  //     }
  //   };

  //   const { onClick, text } = getButtonConfig();

  //   return (
  //     <div className="fixed bottom-2 right-2 zmax">
  //       <button
  //         onClick={(event) => {
  //           event.preventDefault();
  //           onClick();
  //         }}
  //         className="px-4 py-2 bg-black text-white rounded hover:bg-green-800"
  //       >
  //         {text}
  //       </button>
  //     </div>
  //   );
  // };
  return (
    <>
      <OnboardContainer
        title="Review Schedule"
        descriptions={[
          "You will be able to edit specific days later in settings",
        ]}
      />
      <div className="flex flex-col w-50 items-center justify-center gap-1 mt-2">
        {location?.hours?.pickup?.length === 0 ? (
          <div className="text-red-500 font-medium flex items-center text-xs">
            <Clock size={14} className="mr-1" />{" "}
            <span className="font-medium capitalize">No Pickup Hours</span>
          </div>
        ) : (
          <AvailabilityScore scores={scores} type="pickup" />
        )}
        {location?.hours?.delivery?.length === 0 ? (
          <div className="text-red-500 font-medium flex items-center text-xs">
            <Clock size={14} className="mr-1" />{" "}
            <span className="font-medium capitalize">No Delivery Hours</span>
          </div>
        ) : (
          <AvailabilityScore scores={scores} type="delivery" />
        )}
        {location?.hours?.pickup?.length === 0 ? null : (
          <div className={`flex items-center text-md  w-[80%] ${pickupColor}`}>
            {pickupScore === 1
              ? "Your pickup availability might not fit most peoples schedules. While we understand that the best part of having your own store is that you get to choose the hours, we reccomend having a more broad schedule prioritizing times that most people are off work. Generally the hours of 4pm to 8pm for the average working individual, bonus points for catering to the retired population during the hours of around 10 am to 8 pm."
              : pickupScore === 2
              ? "Your pickup availability is pretty good, but it could be better. While we understand that the best part of having your own store is that you get to choose the hours, we reccomend having a more broad schedule prioritizing times that most people are off work. Generally the hours of 4pm to 8pm for the average working individual, bonus points for catering to the retired population during the hours of around 10 am to 8 pm."
              : pickupScore === 3
              ? "You have fantastic pickup availability, if you keep these hours whenever you have produce you will maximise sales!"
              : "ERROR"}
          </div>
        )}
        {location?.hours?.delivery?.length === 0 ? null : (
          <div className={`flex items-center text-md w-[80%] ${deliveryColor}`}>
            {deliveryScore === 1
              ? "Your delivery availability might not fit most peoples schedules.While we understand that the best part of having your own store is that you get to choose the hours, we reccomend having a more broad schedule prioritizing times that most people are off work. Generally the hours of 4pm to 8pm for the average working individual, bonus points for catering to the retired population during the hours of around 10 am to 8 pm."
              : deliveryScore === 2
              ? "Your delivery availability is pretty good, but it could be better. While we understand that the best part of having your own store is that you get to choose the hours, we reccomend having a more broad schedule prioritizing times that most people are off work. Generally the hours of 4pm to 8pm for the average working individual, bonus points for catering to the retired populationj during the hours of around 10 am to 8 pm.."
              : deliveryScore === 3
              ? "You have fantastic delivery availability, if you keep these hours whenever you have produce you will maximise sales!"
              : "ERROR"}
          </div>
        )}
      </div>
      <div
        className={`grid grid-cols-1 lg:grid-cols-2 gap-4 ${OutfitFont.className}`}
      >
        {/* months section */}
        <div className="flex flex-col mb-3">
          <h2 className="text-xl font-normal text-center">Month Schedule</h2>
          <h3 className="text-xs text-neutral-600 font-light text-center">
            Click a Month to Toggle
          </h3>
          <div className="rounded-lg px-0 sm:px-8 pt-1">
            <div className="flex flex-col items-center">
              <div
                className="grid grid-cols-3 sm:grid-cols-4 gap-2"
                onMouseLeave={handleMouseUp}
                onMouseUp={handleMouseUp}
              >
                {months.map((month, index) => (
                  <button
                    key={month}
                    onMouseDown={() => handleMouseDown(index)}
                    onMouseEnter={() => handleMouseEnter(index)}
                    className={`p-8 2xl:p-[3.75rem] text-sm border-[1px] shadow-md rounded-md ${
                      openMonths.includes(index)
                        ? "bg-black text-white"
                        : "bg-white text-black"
                    }`}
                  >
                    {month}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* weekly schedule */}
        <div className="h-[600px]">
          <WeelkyScheduleChart
            location={location}
            handleDayClick={handleDayClick}
            barColor={`rgb(148 163 184)`}
            showSubTitle={true}
            viewBoxHeight={600}
            viewBoxWidth={750}
          />
        </div>{" "}
        {fulfillmentStyle === "both" ? (
          <button
            onClick={() => handleFinishBoth("both")}
            className="px-4 py-2 bg-black text-white rounded hover:bg-green-800 fixed bottom-2 right-4 zmax"
          >
            Save Hours for Both
          </button>
        ) : fulfillmentStyle === "bothone" ? (
          <button
            onClick={() => handleFinishBoth("delivery")}
            className="px-4 py-2 bg-black text-white rounded hover:bg-green-800 fixed bottom-2 right-4 zmax"
          >
            Save Delivery Hours & Set Pickup Hours
          </button>
        ) : (
          <Button
            onClick={handleFinish}
            className="px-4 py-2 bg-black text-white rounded hover:bg-green-800 fixed bottom-2 right-4 zmax"
          >
            Save Hours
          </Button>
        )}
      </div>{" "}
    </>
  );
};

export default StepEight;
