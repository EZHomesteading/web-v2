import { Card, CardContent } from "@/components/ui/card";
import { Location, UserRole } from "@prisma/client";
import AccountCard from "./location-card";

const locationHeadings = [
  { text: "Default Location", style: "text-xl mt-2 font-bold" },
  { text: "Secondary Location", style: "text-xl mt-2 font-semibold" },
  { text: "Third Location", style: "text-xl mt-2 font-medium" },
];

interface LocationProps {
  locations?: Location[];
  apiKey: string;
  role?: UserRole;
  id?: string;
}

const HoursLocationContainer = ({ locations, apiKey, role }: LocationProps) => {
  const renderLocationCards = () => {
    const nonNullLocations = Object.entries(locations || {}).filter(
      ([_, value]) => value !== null
    );
    const nullLocations = Object.entries(locations || {}).filter(
      ([_, value]) => value === null
    );

    return (
      <div>
        {nonNullLocations.length === 0 ? (
          <Card className="col-span-1 h-full bg-red-600 relative justify-center items-center">
            <CardContent className="flex flex-col justify-center items-center h-full pt-3">
              <div>
                You have no default location set. If you would like to create a
                product, this needs to be set up.
              </div>
            </CardContent>
          </Card>
        ) : null}
        {nonNullLocations.map(([key, location], locationIndex) => (
          <AccountCard
            key={key}
            id={location?.id}
            locationHeading={locationHeadings[locationIndex]?.text || ""}
            address={location.address.join(", ")}
          />
        ))}
        {role !== UserRole.PRODUCER && (
          <>
            {nullLocations.map(([key, location], locationIndex) => (
              <AccountCard
                key={key}
                id={location?.id}
                locationHeading={
                  locationHeadings[locationIndex + 1]?.text || ""
                }
                address="No Address or Hours Saved"
              />
            ))}
          </>
        )}
      </div>
    );
  };

  return <>{renderLocationCards()}</>;
};

export default HoursLocationContainer;
