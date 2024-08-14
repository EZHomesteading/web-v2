import React from "react";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Checkbox } from "@/app/components/ui/checkbox";
import Counter from "@/app/create/components/Counter";
import Input from "@/app/create/components/listing-input";
import UnitSelect, { QuantityTypeValue } from "./components/UnitSelect";
import { InputProps } from "./create.types";
import Heading from "@/app/components/Heading";

interface StepThreeProps {
  quantityType: QuantityTypeValue;
  setQuantityType: (value: QuantityTypeValue) => void;
  postSODT: boolean;
  handleSODTCheckboxChange: (checked: boolean, index: number) => void;
  nonPerishable: boolean;
  handleNonPerishableCheckboxChange: (checked: boolean, index: number) => void;
  shelfLifeDays: number;
  shelfLifeWeeks: number;
  shelfLifeMonths: number;
  shelfLifeYears: number;
  setCustomValue: (id: string, value: any) => void;
  expiryDate: string;
  usersodt: number | null;
  inputProps: InputProps;
}

const StepThree: React.FC<StepThreeProps> = ({
  quantityType,
  setQuantityType,
  postSODT,
  handleSODTCheckboxChange,
  nonPerishable,
  handleNonPerishableCheckboxChange,
  shelfLifeDays,
  shelfLifeWeeks,
  shelfLifeMonths,
  shelfLifeYears,
  setCustomValue,
  expiryDate,
  usersodt,
  inputProps,
}) => {
  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-114.39px)] md:h-full fade-in">
      <Heading
        title="Add Quantity, Shelf Life, and Units"
        subtitle="Not worth your time for someone to order less than a certain amount of this item? Set a minimum order requirement, or leave it at 1"
      />
      <div className="flex flex-col justify-center items-start gap-2">
        <div className="w-full xl:w-2/3">
          <div className="flex flex-row gap-2">
            <div className="w-1/2">
              <Input
                {...inputProps}
                id="stock"
                label="Quantity"
                type="number"
                maxlength={6}
              />
            </div>
            <div className="w-1/2">
              <UnitSelect
                value={quantityType}
                onChange={(value) => {
                  setQuantityType(value as QuantityTypeValue);
                  inputProps.setValue("quantityType", value?.value);
                }}
              />
            </div>
          </div>
          <div className="flex flex-row gap-2 mt-2">
            <div className="w-1/2">
              <Input
                {...inputProps}
                id="price"
                label="Price per unit"
                type="number"
                step="0.01"
                formatPrice
                maxlength={6}
              />
            </div>
            <div className="w-1/2">
              <Input
                {...inputProps}
                id="minOrder"
                label="Minimum order"
                type="number"
                maxlength={4}
              />
            </div>
          </div>
          <div className="m-0 p-0 md:mb-3 mt-5 border-black border-[1px] w-full"></div>

          <div className="w-full">
            <div className="flex flex-col gap-2 mt-2">
              <Label className="text-xl w-full">Time to Prepare an Order</Label>

              <Select
                onValueChange={(value: string) => {
                  inputProps.setValue("sodt", value);
                }}
              >
                <div className="flex flex-col items-start gap-y-3">
                  <SelectTrigger className="w-fit h-1/6 bg-slate-300 text-black text-xl">
                    {usersodt ? (
                      <SelectValue placeholder={`${usersodt} Minutes `} />
                    ) : (
                      <SelectValue placeholder={"Select a Time"} />
                    )}
                  </SelectTrigger>
                  {!usersodt && inputProps.watch("sodt") !== null && (
                    <Checkbox
                      id="saveAsDefault"
                      checked={postSODT}
                      onCheckedChange={(checked: boolean) =>
                        handleSODTCheckboxChange(checked, 0)
                      }
                      label="Save as Account Default"
                    />
                  )}
                </div>
                <SelectContent className="bg-slate-300">
                  <SelectGroup>
                    <SelectItem value="15">15 Minutes</SelectItem>
                    <SelectItem value="30">30 Minutes</SelectItem>
                    <SelectItem value="45">45 Minutes</SelectItem>
                    <SelectItem value="60">1 Hour</SelectItem>
                    <SelectItem value="75">1 Hour 15 Minutes</SelectItem>
                    <SelectItem value="90">1 Hour 30 Minutes</SelectItem>
                    <SelectItem value="105">1 Hour 45 Minutes</SelectItem>
                    <SelectItem value="120">2 Hours</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="m-0 p-0 md:mb-3 mt-5 border-black border-[1px] w-full xl:w-2/3"></div>
        <div className="w-full lg:w-1/2">
          <div className="flex flex-col lg:flex-row items-start justify-between w-[50vw] lg:items-center ">
            <Label className="text-xl">Estimated Shelf Life </Label>
            <Checkbox
              id="nonPerishable"
              checked={nonPerishable}
              onCheckedChange={(checked: boolean) =>
                handleNonPerishableCheckboxChange(checked, 0)
              }
              label="Is this item non-perishable?"
            />
          </div>
          {nonPerishable === false ? (
            <div>
              <div className="text-xs">
                {expiryDate ? <>Estimated Expiry Date: {expiryDate}</> : <></>}
              </div>
              <div className="mt-1 space-y-2">
                <Counter
                  onChange={(value: number) =>
                    setCustomValue("shelfLifeDays", value)
                  }
                  value={shelfLifeDays}
                  title="Days"
                  subtitle=""
                  maximum={31}
                />
                <Counter
                  onChange={(value: number) =>
                    setCustomValue("shelfLifeWeeks", value)
                  }
                  value={shelfLifeWeeks}
                  title="Weeks"
                  subtitle=""
                  maximum={4}
                />
                <Counter
                  onChange={(value: number) =>
                    setCustomValue("shelfLifeMonths", value)
                  }
                  value={shelfLifeMonths}
                  title="Months"
                  subtitle=""
                  maximum={12}
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
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default StepThree;
