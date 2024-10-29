import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface p {
  explanation: string;
  icon: any;
}

const CreatePopover = ({ icon, explanation }: p) => {
  return (
    <>
      <Popover>
        <PopoverTrigger>{icon}</PopoverTrigger>
        <PopoverContent>{explanation}</PopoverContent>
      </Popover>
    </>
  );
};

export default CreatePopover;
