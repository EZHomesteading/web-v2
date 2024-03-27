"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useTheme } from "next-themes";
import { SafeListing } from "@/app/types";

import HeartButton from "../ui/HeartButton";
import Button from "../Button";

interface ListingCardProps {
  data: SafeListing;
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
  secondActionId?: string;
  secondActionLabel?: string;
  onSecondAction?: (id: string) => void;
  user?: any | null;
}

const ListingCard: React.FC<ListingCardProps> = ({
  data,
  onAction,
  disabled,
  actionLabel,
  actionId = "",
  user,
  secondActionId,
  onSecondAction,
  secondActionLabel,
}) => {
  const router = useRouter();
  const { theme } = useTheme();

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (disabled) {
        return;
      }

      onAction?.(actionId);
    },
    [disabled, onAction, actionId]
  );

  const handleSecondAction = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (disabled) {
        return;
      }

      onSecondAction?.(actionId);
    },
    [disabled, onSecondAction, secondActionId]
  );

  const cardBackgroundLight = "#ffffff";
  const cardBackgroundDark = "#666666";

  const cardStyle = {
    backgroundColor:
      theme === "light" ? cardBackgroundLight : cardBackgroundDark,
  };

  return (
    <div
      onClick={() => router.push(`/listings/${data.id}`)}
      className="col-span-1 cursor-pointer group"
    >
      <div className="flex flex-col gap-2 w-full">
        {" "}
        <div
          className="
            aspect-square 
            w-full 
            relative 
            overflow-hidden 
            rounded-xl
          "
          style={cardStyle}
        >
          <Image
            className="
              object-cover 
              h-full 
              w-full 
              group-hover:scale-110 
              transition
            "
            src={data.imageSrc}
            alt={data.title}
            height={300}
            width={300}
          />
          <div
            className="
            absolute
            top-3
            right-3
          "
          >
            <HeartButton listingId={data.id} user={user} />
          </div>
        </div>
        <div className="font-semibold text-lg">
          {" "}
          <div className="font-semibold text-lg"> {data.title}</div>
          <div className="font-light text-neutral-500">
            {data?.city}, {data?.state}
          </div>
        </div>
        <div className="flex flex-row items-center gap-1">
          {" "}
          <div className="font-semibold"> $ {data.price}</div>
          {data.quantityType && (
            <div className="font-light">per {data.quantityType}</div>
          )}
        </div>
        {onAction && actionLabel && (
          <Button
            disabled={disabled}
            small
            label={actionLabel}
            onClick={handleCancel}
          />
        )}
        {onSecondAction && secondActionLabel && (
          <Button
            disabled={disabled}
            small
            label={secondActionLabel}
            onClick={handleSecondAction}
          />
        )}
      </div>
    </div>
  );
};

export default ListingCard;
