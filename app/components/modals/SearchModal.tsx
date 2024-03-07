"use client";

import qs from "query-string";
import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSearchModal from "@/app/hooks/useSearchModal";
import Modal from "./Modal";
import Heading from "../Heading";
import { FieldValues, useForm } from "react-hook-form";
import LocationSearchInput from "../map/LocationSearchInput";
import SearchClientUser, { ProductValue } from "@/app/search/SearchClientUser";
import { useTheme } from "next-themes";

// Enum defining the steps of the search process
enum STEPS {
  LOCATION = 0,
  ITEM = 1,
}

// SearchModal component
const SearchModal = () => {
  // Hooks for managing state and navigation
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const router = useRouter();
  const searchModal = useSearchModal();
  const params = useSearchParams();
  const [product, setProduct] = useState<ProductValue>();

  const {
    register,
    formState: { errors },
  } = useForm<FieldValues>({
    // Default values for form fields
    defaultValues: {
      title: "",
    },
  });
  const { theme } = useTheme();
  const inputColor = theme === "dark" ? "#222222" : "#222222";
  // State variables for managing search parameters
  const [step, setStep] = useState(STEPS.LOCATION);

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

  let bodyContent = (
    <>
      <Heading
        title="Where should we look?"
        subtitle="We'll find produce & self-sufficiency items based on the location you enter."
      />
      <LocationSearchInput
        address={address}
        setAddress={setAddress}
        setStreet={setStreet}
        setCity={setCity}
        setState={setState}
        setZip={setZip}
      />
    </>
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
          <div style={{ color: inputColor }}>
            <SearchClientUser
              value={product}
              onChange={(e) => {
                setTitle(e.value);
              }}
            />
          </div>
        </div>
      </div>
    );
  }
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
