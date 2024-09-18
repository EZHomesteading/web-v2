import { Button } from "@/app/components/ui/button";
import React from "react";

interface AccountCardProps {
  title: string;
  info?: string;
  children: React.ReactNode;
  onSave: () => void;
  isEditing: boolean;
  onEditStart: () => void;
  onEditCancel: () => void;
  isDisabled: boolean;
}

const AccountCard: React.FC<AccountCardProps> = ({
  title,
  info,
  children,
  onSave,
  isEditing,
  onEditStart,
  onEditCancel,
  isDisabled,
}) => {
  const handleEditClick = () => {
    if (isEditing) {
      onEditCancel();
    } else {
      onEditStart();
    }
  };

  const handleSaveClick = () => {
    onSave();
  };

  return (
    <div
      className={`pt-5 transition-opacity duration-300 ${
        isDisabled ? "opacity-50 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="text-md font-normal">{title}</div>
          {!isEditing && <div className="font-light text-sm">{info}</div>}
        </div>
        <button
          onClick={handleEditClick}
          className="font-extralight text-xs border p-1 rounded-md w-[50px]"
          disabled={isDisabled}
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>
      {isEditing && (
        <div className="mt-2">
          {children}
          <Button
            onClick={handleSaveClick}
            className="mt-2 font-normal text-sm"
          >
            Save Changes
          </Button>
        </div>
      )}
      <div className="border-b-[1px] pb-3 mt-3" />
    </div>
  );
};

export default AccountCard;
