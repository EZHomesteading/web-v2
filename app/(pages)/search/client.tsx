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
import SearchClient from "@/app/components/client/SearchClientName";
import { Button } from "@/app/components/ui/button";
import { listingValue } from "@/app/components/client/SearchClientName";
//data should have listingValue as type property, but causes an error unknown why.
interface ProductSelectProps {
  data: any;
}

const Search: React.FC<ProductSelectProps> = ({ data }) => {
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
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
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
    let updatedQuery: any = {};
    if (location && search && subCategory) {
      updatedQuery = {
        ...currentQuery,
        location,
        search,
        subCategory,
      };
    } else if (location && search) {
      updatedQuery = {
        ...currentQuery,
        location,
        search,
      };
    } else if (subCategory && location) {
      updatedQuery = {
        ...currentQuery,
        subCategory,
        location,
      };
    } else if (subCategory && search) {
      updatedQuery = {
        ...currentQuery,
        subCategory,
        search,
      };
    } else if (subCategory) {
      updatedQuery = {
        ...currentQuery,
        subCategory,
      };
    } else if (search) {
      updatedQuery = {
        ...currentQuery,
        search,
      };
    } else if (location) {
      updatedQuery = {
        ...currentQuery,
        location,
      };
    }
    const url = qs.stringifyUrl(
      {
        url: "/shop",
        query: updatedQuery,
      },
      { skipNull: true }
    );

    router.push(url);
  }, [router, subCategory, search, params]);

  return (
    <>
      <Heading
        title="Where should we look?"
        subtitle="We'll find produce & self-sufficiency items based on the location you enter."
      />
      <LocationSearchInput
        address={watch("address")}
        setAddress={(address) => setLocation(address)}
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
        <div>
          <div style={{ color: inputColor }}>
            <SearchClient
              data={data}
              onChange={(e) => {
                setSearch(e.value);
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
};

export default Search;
