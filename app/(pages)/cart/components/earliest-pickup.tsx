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
    <Card onClick={handleAsSoonAsPossible} className="bg-inherit border-none">
      <CardHeader
        className={`text-2xl 2xl:text-3xl pb-0 mb-0 ${outfit.className}`}
      >
        Pickup as soon as possible
      </CardHeader>
      <CardContent className={`${outfit.className}`}>
        In a hurry? The earliest possible time for pickup from this co-op is{" "}
        <span className={`${outfit.className} text-lg`}>
          {earliestPickupTime || "loading..."}
        </span>
      </CardContent>
    </Card>
  );
};

export default EarliestPickup;
