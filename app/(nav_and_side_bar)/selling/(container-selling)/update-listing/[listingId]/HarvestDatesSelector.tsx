import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

type Month =
  | "Jan"
  | "Feb"
  | "Mar"
  | "Apr"
  | "May"
  | "Jun"
  | "Jul"
  | "Aug"
  | "Sep"
  | "Oct"
  | "Nov"
  | "Dec";

interface HarvestDatesSelectorProps {
  initialDates: Month[];
  onChange: (dates: Month[]) => void;
}

const HarvestDatesSelector: React.FC<HarvestDatesSelectorProps> = ({
  initialDates,
  onChange,
}) => {
  const [harvestDates, setHarvestDates] = useState<Month[]>(initialDates);

  const months: Month[] = [
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
    onChange(harvestDates);
  }, [harvestDates, onChange]);

  const toggleMonth = (month: Month) => {
    setHarvestDates((prevDates) => {
      const newDates = prevDates.includes(month)
        ? prevDates.filter((date) => date !== month)
        : [...prevDates, month];
      return newDates;
    });
  };

  return (
    <div className="mb-4">
      <h1 className="text-lg lg:text-3xl">Harvest Dates</h1>
      <ul>
        <li>
          Months you expect your product to be available with the given quantity
          per day.
        </li>
      </ul>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {months.map((month) => (
          <Button
            key={month}
            onClick={() => toggleMonth(month)}
            variant={harvestDates.includes(month) ? "default" : "outline"}
            className="w-full"
          >
            {month}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default HarvestDatesSelector;
