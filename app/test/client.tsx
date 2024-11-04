"use client";
import { useEffect, useState } from "react";
import { outfitFont } from "@/components/fonts";
import { DeliveryPickupToggleMode } from "../(nav_and_side_bar_layout)/selling/(container-selling)/availability-calendar/(components)/helper-components-calendar";
import { Hours, Location } from "@prisma/client";
import SetCustomPickupDeliveryCalendar from "./calendar.cart";
import ContainerCart from "./container.cart";
import { Button } from "@/components/ui/button";
import {
  hasAvailableHours,
  week_day_mmm_dd_yy_time,
} from "../(nav_and_side_bar_layout)/selling/(container-selling)/availability-calendar/(components)/helper-functions-calendar";
const STEPS = {
  QUANTITIES: "QUANTITIES",
  ORDER_TYPE: "ORDER_TYPE",
  PICKUP_TIME_PREFERENCE: "PICKUP_TIME_PREFERENCE",
  PICKUP_CUSTOM_TIME: "PICKUP_CUSTOM_TIME",
  DELIVERY_LOCATION: "DELIVERY_LOCATION",
  DELIVERY_TIME_PREFERENCE: "DELIVERY_TIME_PREFERENCE",
  DELIVERY_CUSTOM_TIME: "DELIVERY_CUSTOM_TIME",
  NOTES: "NOTES",
  REVIEW: "REVIEW",
} as const;

type Step = (typeof STEPS)[keyof typeof STEPS];

const ORDER_TYPES = {
  PICKUP: "PICKUP",
  DELIVERY: "DELIVERY",
  EITHER: "EITHER",
} as const;

type OrderType = (typeof ORDER_TYPES)[keyof typeof ORDER_TYPES];

const TIME_PREFERENCES = {
  ASAP: "ASAP",
  CUSTOM: "CUSTOM",
} as const;

type TimePreference = (typeof TIME_PREFERENCES)[keyof typeof TIME_PREFERENCES];

interface ReservationState {
  currentStep: Step;
  previousSteps: Step[];
  orderType: OrderType | null;
  quantities: Record<string, number>;
  pickupTimePreference: TimePreference | null;
  pickupDate: Date | null;
  deliveryLocation: string[] | null;
  deliveryTimePreference: TimePreference | null;
  deliveryDate: { date: Date; time: number } | null;
  notes: string;
}

interface StepProps {
  state: ReservationState;
  onNext: (updates: Partial<ReservationState>) => void;
  onBack: () => void;
}

const initialState: ReservationState = {
  currentStep: STEPS.QUANTITIES,
  previousSteps: [],
  orderType: null,
  quantities: {},
  pickupTimePreference: null,
  pickupDate: null,
  deliveryLocation: null,
  deliveryTimePreference: null,
  deliveryDate: null,
  notes: "",
};
const findEarliestTime = (orderType: OrderType, sellerHours: Hours) => {
  const currentDate = new Date();
  const relevantHours =
    orderType === "DELIVERY" ? sellerHours.delivery : sellerHours.pickup;

  const firstAvailable = relevantHours
    .filter((availability) => new Date(availability.date) >= currentDate)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  let timeString = week_day_mmm_dd_yy_time(
    firstAvailable.timeSlots[0].open,
    firstAvailable.date
  );
  return timeString;
};
interface pp {
  onClick: () => void;
  children?: React.ReactNode;
}

const ContinueButton = ({ onClick }: pp) => {
  return (
    <Button onClick={onClick} className="fixed bottom-2 right-2">
      Continue
    </Button>
  );
};

const BackButton = ({ onClick }: pp) => {
  return (
    <Button onClick={onClick} className="fixed bottom-2 left-2">
      Back
    </Button>
  );
};

interface btnprops {
  onClick: () => void;
  children: React.ReactNode;
  isSelected?: boolean;
  disabled?: boolean;
  className?: string;
}

const ButtonCard: React.FC<btnprops> = ({
  onClick,
  children,
  isSelected,
  disabled = false,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full p-4 border rounded-md transition-all ${className}
        ${isSelected ? "bg-black text-white" : "bg-white hover:bg-gray-50"}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      {children}
    </button>
  );
};

const QuantitiesStep = ({ state, onNext }: StepProps) => (
  <ContainerCart title="Select Quantities">
    <ContinueButton onClick={() => onNext({ currentStep: STEPS.ORDER_TYPE })} />
  </ContainerCart>
);

const OrderTypeStep = ({
  state,
  onNext,
  onBack,
  sellerLoc,
}: StepProps & { sellerLoc?: Location }) => {
  let hasPickup = false;
  let hasDelivery = false;
  console.log("WTF");
  console.log(sellerLoc);
  if (sellerLoc && sellerLoc?.hours) {
    hasPickup = hasAvailableHours(sellerLoc?.hours?.delivery);
    hasDelivery = hasAvailableHours(sellerLoc?.hours?.pickup);
  }

  return (
    <ContainerCart title="How would you like to obtain the order?">
      <div className="gap-3 flex flex-col items-center justify-center">
        {hasPickup && (
          <ButtonCard
            onClick={() =>
              onNext({
                orderType: ORDER_TYPES.PICKUP,
                currentStep: STEPS.PICKUP_TIME_PREFERENCE,
              })
            }
          >
            I want to pick it up
          </ButtonCard>
        )}
        {hasDelivery && (
          <ButtonCard
            onClick={() =>
              onNext({
                orderType: ORDER_TYPES.DELIVERY,
                currentStep: STEPS.DELIVERY_LOCATION,
              })
            }
          >
            I want it delivered
          </ButtonCard>
        )}
        {hasPickup && hasDelivery && (
          <ButtonCard
            onClick={() =>
              onNext({
                orderType: ORDER_TYPES.EITHER,
                currentStep: STEPS.PICKUP_TIME_PREFERENCE,
              })
            }
          >
            I&apos;m open to either
          </ButtonCard>
        )}
      </div>
      <BackButton onClick={onBack} />
    </ContainerCart>
  );
};

const TimePreferenceStep = ({
  state,
  onNext,
  onBack,
  sellerLoc,
}: StepProps & { sellerLoc?: Location }) => {
  const isDelivery = state.currentStep === STEPS.DELIVERY_TIME_PREFERENCE;
  const time_string = findEarliestTime(state.orderType, sellerLoc?.hours);
  return (
    <ContainerCart
      title={`When would you like the order ${
        isDelivery ? "delivered" : "picked up"
      }?`}
    >
      <div className="gap-3 flex flex-col items-center justify-center">
        <ButtonCard
          onClick={() => {
            onNext({
              [isDelivery ? "deliveryTimePreference" : "pickupTimePreference"]:
                TIME_PREFERENCES.ASAP,

              currentStep:
                state.orderType === ORDER_TYPES.EITHER && !isDelivery
                  ? STEPS.DELIVERY_LOCATION
                  : STEPS.NOTES,
            });
          }}
        >
          As soon as possible
          <div>{time_string}</div>
        </ButtonCard>
        <ButtonCard
          onClick={() =>
            onNext({
              [isDelivery ? "deliveryTimePreference" : "pickupTimePreference"]:
                TIME_PREFERENCES.CUSTOM,
              currentStep: isDelivery
                ? STEPS.DELIVERY_CUSTOM_TIME
                : STEPS.PICKUP_CUSTOM_TIME,
            })
          }
        >
          Set custom date & time
        </ButtonCard>
      </div>
      <BackButton onClick={onBack} />
    </ContainerCart>
  );
};

const CustomTimeStep = ({
  state,
  onNext,
  onBack,
  sellerLoc,
  mk,
}: StepProps & { sellerLoc?: Location; mk: string }) => (
  <ContainerCart title="Select a date and time">
    <div className={`w-screen`}>
      <SetCustomPickupDeliveryCalendar
        mode={
          state.currentStep === STEPS.PICKUP_CUSTOM_TIME
            ? DeliveryPickupToggleMode.PICKUP
            : DeliveryPickupToggleMode.DELIVERY
        }
        location={sellerLoc}
        mk={mk}
      />
    </div>
    <BackButton onClick={onBack} />
  </ContainerCart>
);

const DeliveryLocationStep = ({
  state,
  onNext,
  onBack,
  locations,
}: StepProps & { locations: any }) => (
  <ContainerCart title="Where would you like the order delivered?">
    <div className="gap-3 flex flex-col items-center justify-center">
      {locations?.map((location: Location, index: number) => (
        <>
          <ButtonCard
            onClick={() =>
              onNext({
                deliveryLocation: location?.address,
                currentStep: STEPS.DELIVERY_TIME_PREFERENCE,
              })
            }
            isSelected={state.deliveryLocation === location?.address}
          >
            {location?.address?.[0]}
          </ButtonCard>
        </>
      ))}
      <ButtonCard
        onClick={() =>
          onNext({
            deliveryLocation: [], // TO DO
            currentStep: STEPS.DELIVERY_TIME_PREFERENCE,
          })
        }
      >
        Use my current location
      </ButtonCard>
      <ButtonCard
        // onChange={(e) =>
        //   onNext({
        //     deliveryLocation: [], // TO DO
        //     currentStep: STEPS.DELIVERY_TIME_PREFERENCE,
        //   })
        // }
        onClick={() => {}}
      >
        Custom Address
      </ButtonCard>
    </div>
    <BackButton onClick={onBack} />
  </ContainerCart>
);

const NotesStep = ({ state, onNext, onBack }: StepProps) => (
  <ContainerCart title="Notes for seller">
    <textarea
      className="w-full p-4 border rounded"
      value={state.notes}
      onChange={(e) => onNext({ notes: e.target.value })}
    />
    <ContinueButton onClick={() => onNext({ currentStep: STEPS.REVIEW })} />
    <BackButton onClick={onBack} />
  </ContainerCart>
);

const ReviewStep = ({ state, onBack }: StepProps) => (
  <ContainerCart title="Review Your Order">
    {/* Display order summary */}
    <BackButton onClick={onBack} />
    <button onClick={() => console.log("Submit order", state)}>
      Submit Order
    </button>
  </ContainerCart>
);

interface resflowprops {
  sellerLoc?: Location;
  mk: string;
  locations?: Location[];
}

const ReservationFlow = ({ sellerLoc, mk, locations }: resflowprops) => {
  const [state, setState] = useState<ReservationState>(initialState);
  useEffect(() => {
    if (sellerLoc?.hours) {
      const hasPickup = hasAvailableHours(sellerLoc.hours.pickup);
      const hasDelivery = hasAvailableHours(sellerLoc.hours.delivery);

      if (hasPickup && !hasDelivery && state.currentStep === STEPS.ORDER_TYPE) {
        setState((prev) => ({
          ...prev,
          orderType: ORDER_TYPES.PICKUP,
          currentStep: STEPS.PICKUP_TIME_PREFERENCE,
          previousSteps: [...prev.previousSteps, STEPS.ORDER_TYPE],
        }));
      }

      if (!hasPickup && hasDelivery && state.currentStep === STEPS.ORDER_TYPE) {
        setState((prev) => ({
          ...prev,
          orderType: ORDER_TYPES.DELIVERY,
          currentStep: STEPS.DELIVERY_LOCATION,
          previousSteps: [...prev.previousSteps, STEPS.ORDER_TYPE],
        }));
      }
    }
  }, [sellerLoc?.hours, state.currentStep]);
  const handleNext = (updates: Partial<ReservationState>) => {
    setState((prev) => ({
      ...prev,
      ...updates,
      previousSteps: [...prev.previousSteps, prev.currentStep],
    }));
  };

  const handleBack = () => {
    setState((prev) => {
      const newPreviousSteps = [...prev.previousSteps];
      const lastStep = newPreviousSteps.pop();
      return {
        ...prev,
        currentStep: lastStep || STEPS.QUANTITIES,
        previousSteps: newPreviousSteps,
      };
    });
  };

  const renderStep = () => {
    const props = { state, onNext: handleNext, onBack: handleBack };

    switch (state.currentStep) {
      case STEPS.QUANTITIES:
        return <QuantitiesStep {...props} />;
      case STEPS.ORDER_TYPE:
        return <OrderTypeStep {...props} sellerLoc={sellerLoc} />;
      case STEPS.PICKUP_TIME_PREFERENCE:
      case STEPS.DELIVERY_TIME_PREFERENCE:
        return <TimePreferenceStep {...props} sellerLoc={sellerLoc} />;
      case STEPS.PICKUP_CUSTOM_TIME:
      case STEPS.DELIVERY_CUSTOM_TIME:
        return <CustomTimeStep {...props} sellerLoc={sellerLoc} mk={mk} />;
      case STEPS.DELIVERY_LOCATION:
        return <DeliveryLocationStep locations={locations} {...props} />;
      case STEPS.NOTES:
        return <NotesStep {...props} />;
      case STEPS.REVIEW:
        return <ReviewStep {...props} />;
      default:
        return null;
    }
  };

  return <div className={`${outfitFont.className}`}>{renderStep()}</div>;
};

export default ReservationFlow;
