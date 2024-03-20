"use client";

import qs from "query-string";
import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSearchModal from "@/app/hooks/useSearchModal";
import Modal from "@/app/components/modals/Modal";
import Heading from "@/app/components/Heading";
import { FieldValues, useForm } from "react-hook-form";
import LocationSearchInput from "@/app/components/map/LocationSearchInput";
import FindListingsComponent from "@/app/components/find-listings";
import { useTheme } from "next-themes";
import SearchClient, {
  ProductValue,
} from "@/app/components/client/SearchClient";

enum STEPS {
  LOCATION = 0,
  ITEM = 1,
}

const SearchModal = () => {
  type AddressComponents = {
    street: string;
    city: string;
    state: string;
    zip: string;
  };

  const [subCategory, setSubcategory] = useState("");
  const router = useRouter();
  const searchModal = useSearchModal();
  const params = useSearchParams();
  const [product, setProduct] = useState<ProductValue>();

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      subCategory: "",
    },
  });

  const handleAddressSelect = ({
    street,
    city,
    state,
    zip,
  }: AddressComponents) => {
    setValue("street", street);
    setValue("city", city);
    setValue("state", state);
    setValue("zip", zip);
  };

  const { theme } = useTheme();
  const inputColor = theme === "dark" ? "#222222" : "#222222";
  const [step, setStep] = useState(STEPS.LOCATION);

  const onBack = useCallback(() => {
    setStep((value) => value - 1);
  }, []);

  const onNext = useCallback(() => {
    setStep((value) => value + 1);
  }, []);
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
      subCategory,
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
  }, [step, searchModal, location, router, onNext, subCategory, params]);

  const actionLabel = useMemo(() => {
    if (step === STEPS.ITEM) {
      return "Search";
    }

    return "Next";
  }, [step]);

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
        address={watch("address")}
        setAddress={(address) => setValue("address", address)}
        onAddressParsed={handleAddressSelect}
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
            <SearchClient
              value={product}
              onChange={(e) => {
                setSubcategory(e.value);
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
