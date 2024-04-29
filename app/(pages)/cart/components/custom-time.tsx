import { SheetTrigger, SheetContent } from "@/app/components/ui/sheet";
import { HoursDisplay } from "@/app/components/co-op-hours/hours-display";
import { Card, CardHeader, CardContent } from "@/app/components/ui/card";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/app/components/ui/popover";
import { Button } from "@/app/components/ui/button";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/app/components/ui/calendar";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Separator } from "@/app/components/ui/separator";
import { CartGroup } from "@/next-auth";
import { ExtendedHours } from "@/next-auth";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

interface Props {
  hours: ExtendedHours;
  date: Date | undefined;
  now: Date;
  cartGroup: CartGroup | null;
  setTime: any;
  setDate: any;
  options: string[];
}

const CustomTime = ({
  hours,
  date,
  now,
  cartGroup,
  setTime,
  setDate,
  options,
}: Props) => {
  return (
    <div>
      <SheetTrigger>
        <Card className="bg-inherit border-none">
          <CardHeader
            className={`text-2xl 2xl:text-3xl pb-0 mb-0 ${outfit.className}`}
          >
            Set a custom pickup time{" "}
          </CardHeader>
          <CardContent className={`${outfit.className} mt-2`}>
            Not in a rush? Feel free to set a pick up anytime within the
            freshness window of your cart items and this co-op&apos;s open
            hours.
          </CardContent>
        </Card>
      </SheetTrigger>
      <SheetContent
        side="top"
        className="flex flex-col md:flex-row items-center sm:items-start justify-center h-screen w-screen"
      >
        <div className="w-fit border-none shadow-none">
          <div className="grid gap-4">
            <div className="bg-white">
              <div className="px-1 py-[.35rem] rounded-lg border-gray-200 border-[1px]">
                Co-op Hours Each Day
              </div>
              <div className="mt-1">
                <HoursDisplay coOpHours={hours} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[200px] sm:w-[280px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                fromMonth={now}
                disabled={{ before: now, after: cartGroup?.expiry }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <ScrollArea className="h-[16.1rem] w-full rounded-md border mt-1">
            <div className="p-4">
              <h4 className="mb-4 text-sm font-medium leading-none">
                Open Hours
              </h4>
              {!options.length ? (
                <div>No available times on this day</div>
              ) : null}
              {options.map((option) => (
                <div key={option} className="hover:bg-slate">
                  <div
                    className="text-sm cursor-pointer hover:bg-slate-400"
                    onClick={() => setTime(option)}
                  >
                    {option}
                  </div>
                  <Separator className="my-2" />
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </div>
  );
};

export default CustomTime;
