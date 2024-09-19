import Avatar from "@/app/components/Avatar";
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
  showSave?: boolean;
  showAvatar?: boolean;
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
  showSave = true,
  showAvatar = false,
}) => {
  const handleEditClick = () => {
    if (isEditing) {
      onEditCancel();
    } else {
      onEditStart();
    }
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
          {!isEditing && !showAvatar && (
            <div className="font-light text-sm">{info}</div>
          )}
          {showAvatar && (
            <div className="py-3">
              <Avatar image={info} />
            </div>
          )}
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
        <div
          className={`${
            showAvatar ? `flex items-center justify-start` : `mt-2`
          }`}
        >
          {children}
          {showSave && (
            <Button
              onClick={onSave}
              className={`${showAvatar ? `` : `mt-2`}  font-normal text-sm`}
            >
              Save Changes
            </Button>
          )}
        </div>
      )}
      <div className="border-b-[1px] pb-3 mt-3" />
    </div>
  );
};

export default AccountCard;
