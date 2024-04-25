import { Card, CardContent, CardHeader } from "@/app/components/ui/card";
import { Outfit } from "next/font/google";
const outfit = Outfit({
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

interface Props {
  handleAsSoonAsPossible: () => void;
  earliestPickupTime: string | undefined;
}
const EarliestPickup = ({
  earliestPickupTime,
  handleAsSoonAsPossible,
}: Props) => {
  return (
    <Card
      className="lg:w-1/4 lg:h-1/4 h-1/3 w-full sm:w-3/4 mx-2 cursor-pointer flex flex-col items-center justify-center sm:justify-start opacity-95 hover:opacity-100 bg-green-100 text-center hover:bg-green-200"
      onClick={handleAsSoonAsPossible}
    >
      <CardHeader
        className={`text-2xl 2xl:text-2xl pb-0 mb-0 ${outfit.className}`}
      >
        Pickup as soon as possible
      </CardHeader>
      <CardContent className="text-sm">
        In a hurry? The earliest possible time for pickup from this co-op is{" "}
        {earliestPickupTime || "loading..."}
      </CardContent>
    </Card>
  );
};

export default EarliestPickup;
