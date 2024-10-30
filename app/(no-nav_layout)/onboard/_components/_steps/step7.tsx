import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PiTrashThin } from "react-icons/pi";
import {
  checkOverlap,
  convertMinutesToTimeString,
  convertTimeStringToMinutes,
} from "@/app/(nav_and_side_bar_layout)/selling/(container-selling)/availability-calendar/(components)/helper-functions-calendar";
import TimePicker from "@/app/(nav_and_side_bar_layout)/selling/(container-selling)/availability-calendar/(components)/time-slot";
import { LocationObj } from "location-types";
import OnboardContainer from "../onboard.container";
interface StepSixProps {
  user: any;
  updateFormData: (newData: { location: LocationObj }) => void;
  formData: string[] | undefined;
  location?: LocationObj;
  selectedDays: string[];
  fulfillmentStyle?: string;
  onComplete: () => void;
  onBack: () => void;
}

const StepSeven: React.FC<StepSixProps> = ({
  updateFormData,
  location,
  selectedDays,
  onComplete,
}) => {
  const [timeSlots, setTimeSlots] = useState([{ open: 360, close: 1080 }]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<number>(0);
  const handleAddTimeSlot = () => {
    if (checkOverlap([timeSlots])) {
      toast.error(
        "Cannot add another set of hours because existing time slots overlap."
      );
      return;
    }
    const lastSlot = timeSlots[timeSlots.length - 1];

    if (lastSlot.close <= 1320) {
      const newOpenTime = lastSlot.close + 60;
      const newCloseTime = newOpenTime + 60;

      if (newCloseTime <= 1440) {
        setTimeSlots((prev) => [
          ...prev,
          {
            open: newOpenTime,
            close: newCloseTime,
          },
        ]);
      } else {
        setTimeSlots((prev) => [...prev, { open: 540, close: 1020 }]);
      }
    } else {
      setTimeSlots((prev) => [...prev, { open: 540, close: 1020 }]);
    }

    setTimeout(() => {
      containerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 100);
    setActiveTab(timeSlots.length);
  };
  const handleTabClick = (index: number) => setActiveTab(index);

  const handleDeleteSlot = (indexToDelete: number) => {
    setTimeSlots((prevSlots) =>
      prevSlots.filter((_, index) => index !== indexToDelete)
    );
    if (activeTab === indexToDelete) setActiveTab(0);
  };

  const getTabTitles = () => {
    return timeSlots.map((_, index) => {
      const suffix = index === 0 ? "st" : index === 1 ? "nd" : "rd";

      return {
        title: (
          <>
            {index === activeTab ? (
              `${getTitle(activeTab)} Hours Set`
            ) : (
              <>
                {index + 1}
                <sup>{suffix}</sup>
              </>
            )}
          </>
        ),
      };
    });
  };

  const getTitle = (index: number) => {
    if (index === 0) return "First";
    else if (index === 1) return "Second";
    else return "Third";
  };

  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const handleTimeSlotChange = (
    slotIndex: number,
    isOpenTime: boolean,
    newTime: string
  ) => {
    setTimeSlots((prevSlots) => {
      const newSlots = [...prevSlots];
      const minutes = convertTimeStringToMinutes(newTime);
      newSlots[slotIndex] = {
        ...newSlots[slotIndex],
        [isOpenTime ? "open" : "close"]: minutes,
      };
      return newSlots;
    });
  };

  const handleSaveChanges = () => {
    if (checkOverlap([timeSlots])) {
      toast.error("Time slots overlap. Please adjust the hours.");
      return;
    }

    if (!location) {
      toast.error("Location data is missing.");
      return;
    }

    const updatedPickup = selectedDays.map((day) => {
      // Find the index of the day in the weekDays array
      const dayIndex = weekDays.indexOf(day);
      // Create a date for the next occurrence of this day
      const date = new Date();
      date.setDate(date.getDate() + ((dayIndex + 7 - date.getDay()) % 7));
      // Set the time to midnight to avoid timezone issues
      date.setHours(0, 0, 0, 0);

      return {
        date: date,
        timeSlots: timeSlots,
        capacity: null,
      };
    });

    const existingPickup = location.hours?.pickup || [];
    const newPickup = existingPickup.filter(
      (pickup: { date: string | number | Date }) =>
        !selectedDays.includes(weekDays[new Date(pickup.date).getUTCDay()])
    );
    newPickup.push(...updatedPickup);

    const updatedLocation: LocationObj = {
      ...location,
      hours: {
        pickup: newPickup,
        delivery: location.hours?.delivery || [],
      },
    };

    updateFormData({ location: updatedLocation });
    toast.success("Store hours updated successfully");
    onComplete();
  };

  return (
    <div className="flex flex-col min-h-[850px]" ref={containerRef}>
      <OnboardContainer
        title="Set Open & Close Hours for"
        descriptions={[
          `${selectedDays.join(", ")}`,
          "Fine-tune your daily schedule later in settings",
        ]}
      >
        {timeSlots.map((slot, index) =>
          activeTab === index ? (
            <div
              key={index}
              className={`absolute left-1/2 transform -translate-x-1/2 bg-white 
            ${index > 0 ? "animate-fadeIn" : ""}
            ${index === timeSlots.length - 1 ? "z-50" : "z-40"}`}
            >
              <div className="flex justify-start items-center mb-3 text-lg relative">
                {getTabTitles().map((tab, index) => (
                  <button
                    key={index}
                    className={`px-3  ${
                      activeTab === index ? "font-semibold border-b" : ""
                    }`}
                    onClick={() => handleTabClick(index)}
                  >
                    {tab.title}
                  </button>
                ))}

                <div>
                  {index !== 0 && (
                    <PiTrashThin
                      className=" text-red-500 hover:cursor-pointer absolute top-1/2 transform -translate-y-1/2 right-0"
                      onClick={() => handleDeleteSlot(index)}
                    />
                  )}
                </div>
              </div>
              <TimePicker
                top={true}
                value={convertMinutesToTimeString(slot.open)}
                onChange={(time) => handleTimeSlotChange(index, true, time)}
                isOpen={true}
              />
              <TimePicker
                top={false}
                value={convertMinutesToTimeString(slot.close)}
                onChange={(time) => handleTimeSlotChange(index, false, time)}
                isOpen={true}
              />
              {timeSlots.length >= 3 ? null : (
                <Button
                  onClick={handleAddTimeSlot}
                  className="h-12 w-full bg-slate-500/60 border mt-2"
                >
                  Add Another Set of Hours
                </Button>
              )}
              <Button
                onClick={handleSaveChanges}
                className="bg-slate-500/60 h-12 my-2 w-full border mb-10"
              >
                Save Changes
              </Button>
            </div>
          ) : null
        )}
      </OnboardContainer>
    </div>
  );
};

export default StepSeven;
