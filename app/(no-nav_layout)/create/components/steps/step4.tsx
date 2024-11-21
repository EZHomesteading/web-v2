import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Counter from "../Counter";
interface p {
  nonPerishable: boolean;
  handleNonPerishableCheckboxChange: (checked: boolean, index: number) => void;
  shelfLifeDays: number;
  shelfLifeWeeks: number;
  shelfLifeMonths: number;
  shelfLifeYears: number;
  setCustomValue: (id: string, value: any) => void;
  expiryDate: string;
}
const StepFour = ({
  nonPerishable,
  handleNonPerishableCheckboxChange,
  shelfLifeDays,
  shelfLifeWeeks,
  shelfLifeMonths,
  shelfLifeYears,
  setCustomValue,
  expiryDate,
}: p) => {
  return (
    <>
      <div className="flex flex-col gap-4 min-h-screen fade-in pt-[10%] px-4">
        <div className="flex flex-row justify-center items-start gap-2 select-none">
          <div className="w-full sm:max-w-[500px]">
            <div className="flex flex-col ">
              <Label className="text-xl w-full font-light m-0 !leading-0">
                Estimated Shelf Life
              </Label>
              <div className="text-xs font-extralight text-neutral-500 mb-2">
                How long do you estimate your product will last before expiring?
              </div>
              <div className="flex justify-between items-center mb-5">
                <div className="font-light">
                  Click the box if this item is <em>Non-perishable</em>
                </div>

                <div className="mr-10">
                  <Checkbox
                    id="nonPerishable"
                    checked={nonPerishable}
                    onCheckedChange={(checked: boolean) =>
                      handleNonPerishableCheckboxChange(checked, 0)
                    }
                    label=""
                  />
                </div>
              </div>
              {nonPerishable === false ? (
                <div>
                  <div className="mt-1 space-y-2">
                    <Counter
                      onChange={(value: number) =>
                        setCustomValue("shelfLifeDays", value)
                      }
                      value={shelfLifeDays}
                      title="Days"
                      subtitle=""
                      maximum={30}
                    />
                    <Counter
                      onChange={(value: number) =>
                        setCustomValue("shelfLifeWeeks", value)
                      }
                      value={shelfLifeWeeks}
                      title="Weeks"
                      subtitle=""
                      maximum={3}
                    />
                    <Counter
                      onChange={(value: number) =>
                        setCustomValue("shelfLifeMonths", value)
                      }
                      value={shelfLifeMonths}
                      title="Months"
                      subtitle=""
                      maximum={11}
                    />
                    <Counter
                      onChange={(value: number) =>
                        setCustomValue("shelfLifeYears", value)
                      }
                      value={shelfLifeYears}
                      title="Years"
                      subtitle=""
                      maximum={50}
                    />
                  </div>
                  <div className="text-xs font-extralight">
                    {expiryDate ? (
                      <>Estimated Expiry Date: {expiryDate}</>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StepFour;
