"use client";
import ComboboxPopover from "@/app/components/ui/co-op-hours-open";
import ComboboxPopoverr from "@/app/components/ui/co-op-hours-closed";
import { useState } from "react";
const CoOpHoursPage = () => {
  return (
    <>
      <div className="flex flex-col justify-center items-center mt-10">
        <label>Monday</label>
        <ComboboxPopover
        // onChange={(value) => {setValue("mondayOpen", value))}}
        />
        <ComboboxPopoverr />
        <label>Tuesday</label>
        <ComboboxPopover />
        <ComboboxPopoverr />
        <label>Wednesday</label>
        <ComboboxPopover />
        <ComboboxPopoverr />
        <label>Thursday</label>
        <ComboboxPopover />
        <ComboboxPopoverr />
        <label>Friday</label>
        <ComboboxPopover />
        <ComboboxPopoverr />
        <label>Saturday</label>
        <ComboboxPopover />
        <ComboboxPopoverr />
        <label>Sunday</label>
        <ComboboxPopover />
        <ComboboxPopoverr />
      </div>
    </>
  );
};

export default CoOpHoursPage;
