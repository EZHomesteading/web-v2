"use client";

import qs from "query-string";
import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Heading from "../../components/Heading";
import { FieldValues, useForm } from "react-hook-form";
import LocationSearchInput from "../../components/map/LocationSearchInput";
import SearchClientUser, {
  ProductValue,
} from "@/app/components/client/SearchClientUser";
import { useTheme } from "next-themes";
import SearchClient from "@/app/components/client/SearchClient";
import { Button } from "@/app/components/ui/button";



const SearchModal = () => {
    type AddressComponents = {
        street: string;
        city: string;
        state: string;
        zip: string;
      };
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

  const [subCategory, setSubcategory] = useState("");
  const router = useRouter();

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

  const { theme } = useTheme();
  const inputColor = theme === "dark" ? "#222222" : "#222222";
 
  const onSubmit = useCallback(async () => {
  
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

   
    router.push(url);
  }, [ router,  subCategory, params]);

 return (
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
                setSubcategory(e.value);
              }}
            />
          </div>
        </div>
        <Button
            onClick={onSubmit}
            className="text-neutral-800 cursor-pointer hover:underline"
          >
            SUBMIT
          </Button>
      </div>
      </>
    );
  }


// Export the SearchModal component
export default SearchModal;
