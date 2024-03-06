"use client";

// Import necessary modules and components
import qs from "query-string";
import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSearchModal from "@/app/hooks/useSearchModal";
import Input from "../inputs/Input"; // Generic input component
import Modal from "./Modal";
import CountrySelect, { CountrySelectValue } from "../inputs/CountrySelect";
import Heading from "../Heading";
import { FieldValues, useForm } from "react-hook-form";

// Enum defining the steps of the search process
enum STEPS {
  LOCATION = 0,
  ITEM = 1,
}

// SearchModal component
const SearchModal = () => {
  // Hooks for managing state and navigation
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchModal = useSearchModal();
  const params = useSearchParams();

  const {
    register,
    formState: { errors },
  } = useForm<FieldValues>({
    // Default values for form fields
    defaultValues: {
      title: "",
    },
  });

  // State variables for managing search parameters
  const [step, setStep] = useState(STEPS.LOCATION);
  const [location, setLocation] = useState<CountrySelectValue>();

  // Dynamic import of the Map component based on location
  const Map = useMemo(
    () => dynamic(() => import("../Map"), { ssr: false }),
    [location]
  );

  // Function to navigate back a step
  const onBack = useCallback(() => {
    setStep((value) => value - 1);
  }, []);

  // Function to navigate to the next step
  const onNext = useCallback(() => {
    setStep((value) => value + 1);
  }, []);

  // Function to handle form submission
  const onSubmit = useCallback(async () => {
    if (step !== STEPS.ITEM) {
      return onNext();
    }

    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    const updatedQuery: any = {
      ...currentQuery,
      locationValue: location?.value,
      title,
    };

    const url = qs.stringifyUrl(
      {
        url: "/shop",
        query: updatedQuery,
      },
      { skipNull: true }
    );

    setStep(STEPS.LOCATION);
    searchModal.onClose();
    router.push(url);
  }, [step, searchModal, location, router, onNext, title, params]);

  // Determine the label for the primary action button
  const actionLabel = useMemo(() => {
    if (step === STEPS.ITEM) {
      return "Search";
    }

    return "Next";
  }, [step]);

  // Determine the label for the secondary action button
  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.LOCATION) {
      return undefined;
    }

    return "Back";
  }, [step]);

  // Content for the modal body based on the current step
  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading title="Where should we look for produce?" />
      <CountrySelect
        value={location}
        onChange={(value) => setLocation(value as CountrySelectValue)}
      />
      <hr />
      <Map center={location?.latlng} />
    </div>
  );

  if (step === STEPS.ITEM) {
    // Form fields for specifying location
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="What are you looking for?"
          subtitle="Search for produce & self sufficieny items"
        />
        <div>
          <input
            id="title"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            required
          />
        </div>
      </div>
    );
  }
  // Update bodyContent based on the current step

  // Render the SearchModal component
  return (
    <Modal
      isOpen={searchModal.isOpen}
      title="Filters"
      actionLabel={actionLabel}
      onSubmit={onSubmit}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.LOCATION ? undefined : onBack}
      onClose={searchModal.onClose}
      body={bodyContent}
    />
  );
};

// Export the SearchModal component
export default SearchModal;
