"use client";
import ComboboxPopover from "@/app/components/ui/co-op-hours-open";
import ComboboxPopoverr from "@/app/components/ui/co-op-hours-closed";
const CoOpHoursPage = () => {
  return (
    <>
      <div className="flex flex-col justify-center items-center mt-10">
        <ComboboxPopover />
        <ComboboxPopoverr />
        <ComboboxPopover />
        <ComboboxPopoverr />
        <ComboboxPopover />
        <ComboboxPopoverr />
        <ComboboxPopover />
        <ComboboxPopoverr />
        <ComboboxPopover />
        <ComboboxPopoverr />
        <ComboboxPopover />
        <ComboboxPopoverr />
      </div>
    </>
  );
};

export default CoOpHoursPage;
