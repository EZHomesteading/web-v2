import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "../ui/sheet";
import { Slider } from "./radius-slider";
import { Switch } from "../ui/switch";
import FiltersIcon from "../icons/filters-icon";

interface Props {
  user?: any;
}
const Filters = ({ user }: Props) => {
  return (
    <Sheet>
      <SheetTrigger className="flex flex-row border-[1px] border-gray-500 rounded-full px-2 py-2 bg-transparent">
        <FiltersIcon /> Filters
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-screen sm:w-1/2 md:w-1/3 2xl:w-1/5 px-2 sm:px-4 flex flex-col"
      >
        <SheetHeader>Filters</SheetHeader>

        <>
          <div>
            <Switch />
            Co-ops
          </div>
          <div>
            <Switch />
            Producers
          </div>
        </>
        <div>
          <Switch /> Pick Produce Myself
        </div>
        <SheetTrigger onClick={() => {}}>See Listings</SheetTrigger>
      </SheetContent>
    </Sheet>
  );
};

export default Filters;
