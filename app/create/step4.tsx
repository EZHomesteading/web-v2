import { Checkbox } from "@/app/components/ui/checkbox";
import { Label } from "@/app/components/ui/label";
import Heading from "@/app/components/Heading";

interface StepFourProps {
  checkbox1Checked: boolean;
  checkbox2Checked: boolean;
  checkbox3Checked: boolean;
  checkbox4Checked: boolean;
  certificationChecked: boolean;
  handleCheckboxChange: (checked: boolean, index: number) => void;
  handleCertificationCheckboxChange: (checked: boolean) => void;
}

const StepFour: React.FC<StepFourProps> = ({
  checkbox1Checked,
  checkbox2Checked,
  checkbox3Checked,
  checkbox4Checked,
  certificationChecked,
  handleCheckboxChange,
  handleCertificationCheckboxChange,
}) => {
  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-122.39px)] md:h-full fade-in">
      <Heading
        title="Help Us Keep EZHomesteading Honestly Organic"
        subtitle="Your base score is one, only check the boxes if they are accurate"
      />
      <div className="flex flex-col gap-y-2">
        <div className="flex flex-row gap-x-2 items-center">
          <Checkbox
            checked={checkbox1Checked}
            onCheckedChange={(checked: boolean) =>
              handleCheckboxChange(checked, 0)
            }
          />
          <Label>This produce is not genetically modified</Label>
        </div>
        <div className="flex flex-row gap-x-2 items-center">
          <Checkbox
            checked={checkbox2Checked}
            onCheckedChange={(checked: boolean) =>
              handleCheckboxChange(checked, 1)
            }
          />
          <Label>This produce was not grown with inorganic fertilizers</Label>
        </div>
        <div className="flex flex-row gap-x-2 items-center">
          <Checkbox
            checked={checkbox3Checked}
            onCheckedChange={(checked: boolean) =>
              handleCheckboxChange(checked, 2)
            }
          />
          <Label>This produce was not grown with inorganic pesticides</Label>
        </div>
        <div className="flex flex-row gap-x-2 items-center">
          <Checkbox
            checked={checkbox4Checked}
            onCheckedChange={(checked: boolean) =>
              handleCheckboxChange(checked, 3)
            }
          />
          <Label>This produce was not modified after harvest</Label>
        </div>
        <div className="flex flex-row gap-x-2 font-extrabold items-center">
          <Checkbox
            checked={certificationChecked}
            onCheckedChange={(checked: boolean) =>
              handleCertificationCheckboxChange(checked)
            }
          />
          <Label className="font-bold">
            I certify that all of the above information is accurate
          </Label>
        </div>
      </div>
    </div>
  );
};

export default StepFour;
