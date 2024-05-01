import { ExtendedHours } from "@/next-auth";
interface StatusProps {
  hours: ExtendedHours;
}

const isOpenNow = (
  todayHours: { open: number; close: number }[] | null
): boolean => {
  if (!todayHours) {
    return false;
  }

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  return todayHours.some(
    (slot) => currentMinutes >= slot.open && currentMinutes <= slot.close
  );
};

const OpenStatus = ({ hours }: StatusProps) => {
  if (!hours) {
    return <span className="text-xs text-gray-500">No hours available</span>;
  }
  const currentDayIndex = (new Date().getDay() + 6) % 7;
  const todayHours = hours[currentDayIndex as keyof ExtendedHours];
  console.log("todayhours:", todayHours);
  const open = isOpenNow(todayHours);
  return (
    <span className={`text-xs ${open ? "text-green-500" : "text-red-500"}`}>
      {open ? "Open" : "Closed"}
    </span>
  );
};

export default OpenStatus;
