import { Button } from "@/components/ui/button";
import { MessageOption } from "chat-types";

interface MessageActionsProps {
  options: MessageOption[];
  onSelect: (option: MessageOption) => void;
  isLoading: boolean;
}

export const MessageActions: React.FC<MessageActionsProps> = ({
  options,
  onSelect,
  isLoading,
}) => (
  <div className="flex flex-col gap-2 mt-2">
    {options.map((option, index) => (
      <Button
        key={index}
        onClick={() => onSelect(option)}
        disabled={isLoading}
        variant="ghost"
        className="justify-start gap-2"
      >
        {option.icon}
        {isLoading ? "loading" : option.label}
      </Button>
    ))}
  </div>
);
