"use client";

// Importing necessary components and styles from react-date-range library
import {
  DateRange, // DateRange component for selecting date ranges
  Range, // Range type for defining date range
  RangeKeyDict, // RangeKeyDict type for defining date range dictionary
} from "react-date-range";

// Importing styles for DateRange component
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

// Interface defining props accepted by the DatePicker component
interface DatePickerProps {
  value: Range; // Current selected date range
  onChange: (value: RangeKeyDict) => void; // Function to handle date range change
  disabledDates?: Date[]; // Array of disabled dates
}

// DatePicker component
const DatePicker: React.FC<DatePickerProps> = ({
  value, // Current selected date range
  onChange, // Function to handle date range change
  disabledDates, // Array of disabled dates
}) => {
  return (
    <DateRange
      rangeColors={["#4caf50"]} // Customizing range color
      ranges={[value]} // Setting current selected date range
      date={new Date()} // Setting current date
      onChange={onChange} // Handling date range change
      direction="vertical" // Setting direction of the calendar
      showDateDisplay={false} // Hiding date display
      minDate={new Date()} // Setting minimum selectable date
      disabledDates={disabledDates} // Setting disabled dates
    />
  );
};

export default DatePicker; // Exporting DatePicker component
