import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface StepFourProps {
  checkbox1Checked: boolean;
  checkbox2Checked: boolean;
  checkbox3Checked: boolean;
  checkbox4Checked: boolean;
  certificationChecked: boolean;
  handleCheckboxChange: (checked: boolean, index: number) => void;
  handleCertificationCheckboxChange: (checked: boolean) => void;
}

const StepFive: React.FC<StepFourProps> = ({
  checkbox1Checked,
  checkbox2Checked,
  checkbox3Checked,
  checkbox4Checked,
  certificationChecked,
  handleCheckboxChange,
  handleCertificationCheckboxChange,
}) => {
  return (
    <div className="flex flex-col gap-4 min-h-screen fade-in pt-[10%]">
      <div className="flex flex-row justify-center items-start gap-2">
        <div className="w-full sm:max-w-[500px] px-4">
          <div className="flex flex-col ">
            <Label className="text-xl w-full font-light m-0 !leading-0">
              Help us Keep EZ Homesteading Organic
            </Label>
            <div className="text-xs font-extralight text-neutral-500 mb-2">
              Check all that apply
            </div>
            <div className="flex flex-col gap-y-2">
              <div className="flex flex-row gap-x-2 items-center">
                <Checkbox
                  checked={checkbox1Checked}
                  onCheckedChange={(checked: boolean) =>
                    handleCheckboxChange(checked, 0)
                  }
                />
                <Label className="font-extralight">
                  This produce is not genetically modified
                </Label>
              </div>
              <div className="flex flex-row gap-x-2 items-center">
                <Checkbox
                  checked={checkbox2Checked}
                  onCheckedChange={(checked: boolean) =>
                    handleCheckboxChange(checked, 1)
                  }
                />
                <Label className="font-extralight">
                  This produce was not grown with inorganic fertilizers
                </Label>
              </div>
              <div className="flex flex-row gap-x-2 items-center">
                <Checkbox
                  checked={checkbox3Checked}
                  onCheckedChange={(checked: boolean) =>
                    handleCheckboxChange(checked, 2)
                  }
                />
                <Label className="font-extralight">
                  This produce was not grown with inorganic pesticides
                </Label>
              </div>
              <div className="flex flex-row gap-x-2 items-center">
                <Checkbox
                  checked={checkbox4Checked}
                  onCheckedChange={(checked: boolean) =>
                    handleCheckboxChange(checked, 3)
                  }
                />
                <Label className="font-extralight">
                  This produce was not modified after harvest
                </Label>
              </div>
              <div className="flex flex-row gap-x-2 font-extrabold items-center">
                <Checkbox
                  checked={certificationChecked}
                  onCheckedChange={(checked: boolean) =>
                    handleCertificationCheckboxChange(checked)
                  }
                />
                <Label className="font-normal">
                  I certify that all of the above information is accurate
                </Label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepFive;
