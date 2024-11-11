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
    {options.map((option, index) => {
      // Create the button content
      const content = (
        <>
          {option.icon && <option.icon className="w-5 h-5" />}
          {isLoading ? "Loading..." : option.label}
        </>
      );

      return (
        <Button
          key={index}
          onClick={() => onSelect(option)}
          disabled={isLoading}
          variant={option.requiresPhoto ? "default" : "ghost"}
          className={`justify-start gap-2 ${
            option.requiresPhoto
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : ""
          }`}
        >
          {content}
        </Button>
      );
    })}
  </div>
);
