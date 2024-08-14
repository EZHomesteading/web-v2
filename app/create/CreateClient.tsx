"use client";
//create listing parent client element
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { UserInfo } from "@/next-auth";
import StepOne from "./step1";
import { Button } from "@/app/components/ui/button";
import { Category, InputProps, SubCategory } from "./create.types";

import axios from "axios";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Heading from "@/app/components/Heading";
import { UploadButton } from "@/utils/uploadthing";
import { Outfit } from "next/font/google";
import Image from "next/image";
import { BsBucket } from "react-icons/bs";
import { QuantityTypeValue } from "./components/UnitSelect";
import { Card, CardHeader } from "../components/ui/card";
import { addDays, format } from "date-fns";
import debounce from "debounce";
import StepTwo from "./step2";
import StepThree from "./step3";
import { CommonInputProps } from "./create.types";
import StepFour from "./step4";
import StepFive from "./step5";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

interface Props {
  user: UserInfo;
  index: number;
}

const CreateClient = ({ user, index }: Props) => {
  //seclare use state variables
  const [rating, setRating] = useState<number[]>([]);
  const [certificationChecked, setCertificationChecked] = useState(false);
  //checkbox usestates
  const [checkbox1Checked, setCheckbox1Checked] = useState(false);
  const [checkbox2Checked, setCheckbox2Checked] = useState(false);
  const [checkbox3Checked, setCheckbox3Checked] = useState(false);
  const [checkbox4Checked, setCheckbox4Checked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(3);
  const [quantityType, setQuantityType] = useState<
    QuantityTypeValue | undefined
  >(undefined);

  const router = useRouter();
  const [clicked, setClicked] = useState(false);
  const [clicked1, setClicked1] = useState(false);
  const [clicked2, setClicked2] = useState(false);
  const [category, setCategory] = useState<Category>("");
  const [subCategory, setSubCategory] = useState<SubCategory>("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  //declare formstate default values
  let usersodt = null;
  if (user.SODT && user.SODT !== null) {
    usersodt = user.SODT;
  }
  let {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      sodt: usersodt,
      category: "",
      subCategory: "",
      location: null,
      stock: null,
      quantityType: "",
      imageSrc: [],
      price: null,
      title: "",
      description: "",
      shelfLifeDays: 0,
      shelfLifeWeeks: 0,
      shelfLifeMonths: 0,
      shelfLifeYears: 0,
      rating: [],
      minOrder: null,
    },
  });
  const handleCheckboxChange = (checked: boolean, index: number) => {
    setRating((prevRating) => {
      let newRating = [...prevRating];
      if (checked) {
        if (!newRating.includes(index + 1)) {
          newRating.push(index + 1);
        }
      } else {
        newRating = newRating.filter((value) => value !== index + 1);
      }
      return newRating.sort((a, b) => a - b);
    });

    switch (index) {
      case 0:
        setCheckbox1Checked(checked);
        break;
      case 1:
        setCheckbox2Checked(checked);
        break;
      case 2:
        setCheckbox3Checked(checked);
        break;
      case 3:
        setCheckbox4Checked(checked);
        break;
      default:
        break;
    }
  };

  const handleCertificationCheckboxChange = (checked: boolean) => {
    setCertificationChecked(checked);
    setRating((prevRating) => {
      if (checked) {
        if (!prevRating.includes(0)) {
          return [0, ...prevRating];
        }
      } else {
        return prevRating.filter((value) => value !== 0);
      }
      return prevRating;
    });
  };
  const shelfLifeDays = watch("shelfLifeDays");
  const shelfLifeWeeks = watch("shelfLifeWeeks");
  const shelfLifeMonths = watch("shelfLifeMonths");
  const shelfLifeYears = watch("shelfLifeYears");
  const minOrder = watch("minOrder");
  const quantity = watch("stock");
  const price = watch("price");
  const sodt = watch("sodt");
  const commonInputProps: CommonInputProps = {
    register,
    errors,
    watch,
    setValue,
    disabled: isLoading,
  };
  const inputProps: InputProps = {
    ...commonInputProps,
    id: "",
    label: "",
    type: "",
  };
  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const [imageSrc, setImageSrc] = useState<string[]>([]);
  const [imageStates, setImageStates] = useState(
    [...Array(3)].map(() => ({
      isHovered: false,
      isFocused: false,
    }))
  );

  const handleMouseEnter = (index: number) => {
    setImageStates((prevStates) =>
      prevStates.map((state, i) =>
        i === index ? { ...state, isHovered: true } : state
      )
    );
  };

  const handleMouseLeave = (index: number) => {
    setImageStates((prevStates) =>
      prevStates.map((state, i) =>
        i === index ? { ...state, isHovered: false } : state
      )
    );
  };

  const handleClick = (index: number) => {
    setImageStates((prevStates) =>
      prevStates.map((state, i) =>
        i === index ? { ...state, isFocused: !state.isFocused } : state
      )
    );
  };

  //geocoding from autocompleted adress inputs

  const onSubmit: SubmitHandler<FieldValues> = async (data: FieldValues) => {
    setIsLoading(true);
    const formattedPrice = parseFloat(parseFloat(data.price).toFixed(2));
    const shelfLife =
      parseInt(data.shelfLifeDays, 10) +
      parseInt(data.shelfLifeWeeks, 10) * 7 +
      parseInt(data.shelfLifeMonths, 10) * 30 +
      parseInt(data.shelfLifeYears, 10) * 365;

    //onsubmit formstate to formdata=data to pass to create listing api endpoint
    const formData = {
      keyWords: tags,
      title: title,
      SODT: parseInt(data.sodt),
      minOrder: parseInt(data.minOrder),
      description: description,
      category: category,
      subCategory: subCategory,
      rating: rating,
      price: formattedPrice,
      imageSrc: data.imageSrc,
      stock: parseInt(data.stock, 10),
      shelfLife: shelfLife,
      quantityType:
        data.quantityType === "none" || data.quantityType === "each"
          ? ""
          : data.quantityType,
      location: data.location,
    };
    axios
      .post("/api/listing/listings", formData)
      .then(() => {
        toast.success("Listing created!");
        setValue("category", "");
        setValue("subCategory", "");
        setValue("location", "");
        setValue("stock", null);
        setValue("quantityType", "");
        setValue("imageSrc", "");
        setValue("price", null);
        setValue("title", "");
        setValue("description", "");
        setValue("shelfLifeDays", 0);
        setValue("shelfLifeWeeks", 0);
        setValue("shelfLifeMonths", 0);
        setValue("shelfLifeYears", 0);
        setValue("sodt", 60);
        setValue("rating", []);
        setValue("minOrder", 1);
        setClicked(false);
        setClicked1(false);
        setClicked2(false);
        setRating([]);
        setTags([]);
        setCertificationChecked(false);
        setQuantityType(undefined);
        router.push("/dashboard/my-store");
      })
      .catch(() => {
        toast.error(
          "Please make sure you've added information for all of the fields.",
          {
            duration: 2000,
            position: "bottom-center",
          }
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const showError = (message: string) => {
    toast.error(message, {
      duration: 2000,
      position: "bottom-center",
    });
  };

  const checkField = (condition: boolean, errorMessage: string): boolean => {
    if (condition) {
      showError(errorMessage);
      return true;
    }
    return false;
  };
  const handleNext = async () => {
    const errors = {
      1: [
        { condition: () => category === "", message: "Set a category!" },
        { condition: () => subCategory === "", message: "Set a Subcategory!" },
      ],
      2: [
        {
          condition: () => title === "",
          message: "Let us know what produce you have!",
        },
        {
          condition: () => !description,
          message: "Please write a brief description",
        },
      ],
      3: [
        {
          condition: () => !quantityType,
          message: "Please enter a unit for your listing",
        },
        {
          condition: () => parseInt(minOrder) > parseInt(quantity),
          message: "Minimum order cannot be more than your quantity",
        },
        {
          condition: () => !sodt,
          message: "Please enter a set out/delivery time for your listing",
        },
        {
          condition: () => parseInt(quantity) <= 0 || !quantity,
          message: "Quantity must be greater than 0",
        },
        {
          condition: () =>
            shelfLifeDays <= 0 &&
            shelfLifeWeeks <= 0 &&
            shelfLifeMonths <= 0 &&
            shelfLifeYears <= 0,
          message: "Shelf life must be at least 1 day",
        },
        {
          condition: () => price <= 0 || !price,
          message: "Please enter a price greater than 0",
        },
        {
          condition: () => parseInt(minOrder) <= 0 || !quantity,
          message: "Please enter a minimum order greater than 0",
        },
      ],
      4: [
        {
          condition: () => !certificationChecked,
          message: "You must certify that the above information is accurate.",
        },
      ],
      5: [
        {
          condition: () => Array.isArray(imageSrc) && imageSrc.length === 0,
          message: "Please upload at least one photo",
        },
      ],
      6: [
        {
          condition: () => Array.isArray(rating) && rating.length === 0,
          message: "Please certify your EZH Organic Rating",
        },
        {
          condition: () => user?.location?.[0] === null,
          message: "Please Set a default location in your store settings",
        },
      ],
    };

    const currentErrors = errors[step as keyof typeof errors] || [];
    for (const error of currentErrors) {
      if (checkField(error.condition(), error.message)) return;
    }

    if (step === 6) {
      handleSubmit(onSubmit)();
    } else {
      setStep(step + 1);
    }
  };
  const handlePrevious = () => {
    setStep(step - 1);
  };

  useEffect(() => {
    if (parseInt(quantity) <= 0) {
      setValue("stock", 1);
    }
    if (parseInt(minOrder) <= 0) {
      setValue("minOrder", 1);
    }
  }),
    [quantity, minOrder];
  const shelfLife =
    parseInt(shelfLifeDays, 10) +
    parseInt(shelfLifeWeeks, 10) * 7 +
    parseInt(shelfLifeMonths, 10) * 30 +
    parseInt(shelfLifeYears, 10) * 365;
  let expiryDate = "";
  if (shelfLife) {
    const endDate = addDays(new Date(), shelfLife);
    expiryDate = format(endDate, "MMM d, yyyy");
  }

  const [postSODT, setPostSODT] = useState(false);
  useEffect(() => {
    setPostSODT(false);
  }, [sodt]);
  const [nonPerishable, setnonPerishable] = useState(false);
  useEffect(() => {
    setnonPerishable(false);
  }, [sodt]);
  const postNewSODT = async (checked: boolean) => {
    try {
      if (checked) {
        await axios.post("api/useractions/update", {
          SODT: sodt !== null ? parseInt(sodt) : null,
        });
      } else {
        await axios.post("api/useractions/update", { SODT: null });
      }
    } catch (error) {
      console.error("Error posting SODT:", error);
    }
  };

  const handleSODTCheckboxChange = (checked: boolean, index: number) => {
    if (index === 0) {
      setPostSODT(checked);
      postNewSODT(checked);
    }
  };
  const handleNonPerishableCheckboxChange = (
    checked: boolean,
    index: number
  ) => {
    if (index === 0) {
      setnonPerishable(checked);
      if (checked === true) {
        setCustomValue("shelfLifeYears", 1000);
      } else {
        setCustomValue("shelfLifeYears", 0);
      }
    }
  };
  {
    if (user?.location && user.location[0] === null) {
      setValue("location", 0);
    }
  }
  function filterAndAppendWords(inputString: string) {
    // List of common words to filter out
    const commonWords = new Set([
      "a",
      "an",
      "and",
      "are",
      "as",
      "at",
      "be",
      "by",
      "for",
      "from",
      "has",
      "he",
      "in",
      "is",
      "it",
      "its",
      "of",
      "on",
      "that",
      "the",
      "to",
      "was",
      "were",
      "will",
      "with",
      "this",
      "these",
      "those",
      "they",
      "my",
      "i",
      "have",
      "then",
      "there",
      "desc",
      "description",
      "product",
      "ass",
      "bitch",
      "cunt",
      "whore",
      "fuck",
      "fuckin",
      "fucking",
    ]);
    // Convert the input string to lowercase and split it into words
    const words = inputString.toLowerCase().match(/\b\w+\b/g) || [];

    // Filter out common words and append remaining words to the result array
    const result = words.filter((word) => !commonWords.has(word));

    return result;
  }
  function removeDuplicates(arr: string[]) {
    return [...new Set(arr)];
  }
  const buildKeyWords = (desc: string) => {
    const keywordarr = filterAndAppendWords(desc);
    const noDupeKeywordArr = removeDuplicates(keywordarr);
    setTags(noDupeKeywordArr);
  };
  const [items, setItems] = useState<any>([]);
  const [isSearching, setIsSearching] = useState(false);
  const handleSearchName = debounce(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const query = event.target.value;
      if (query === "") {
        setItems([]);
        return;
      }
      setIsSearching(true);
      try {
        const response = await fetch(
          `/api/listing/listingSuggestions?query=${encodeURIComponent(query)}`
        );
        const data = await response.json();
        if (data.listings) {
          setItems(data.listings);
        } else {
          setItems([]);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setItems([]);
      } finally {
        setIsSearching(false);
      }
    },
    1000
  );
  return (
    <div className={`px-8 min-h-screen ${outfit.className}`}>
      {step === 1 && (
        <StepOne
          step={step}
          subCategory={subCategory}
          setSubCategory={setSubCategory}
          category={category}
          setCategory={setCategory}
        />
      )}
      {step === 2 && (
        <StepTwo
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          tag={tag}
          setTag={setTag}
          tags={tags}
          setTags={setTags}
          handleSearchName={handleSearchName}
          isSearching={isSearching}
          items={items}
          buildKeyWords={buildKeyWords}
          isLoading={isLoading}
        />
      )}
      {step === 3 && (
        <StepThree
          quantityType={quantityType}
          setQuantityType={setQuantityType}
          postSODT={postSODT}
          handleSODTCheckboxChange={handleSODTCheckboxChange}
          nonPerishable={nonPerishable}
          handleNonPerishableCheckboxChange={handleNonPerishableCheckboxChange}
          shelfLifeDays={shelfLifeDays}
          shelfLifeWeeks={shelfLifeWeeks}
          shelfLifeMonths={shelfLifeMonths}
          shelfLifeYears={shelfLifeYears}
          setCustomValue={setCustomValue}
          expiryDate={expiryDate}
          usersodt={user.SODT ?? null}
          commonInputProps={commonInputProps}
          inputProps={inputProps}
        />
      )}
      {step === 4 && (
        <StepFour
          checkbox1Checked={checkbox1Checked}
          checkbox2Checked={checkbox2Checked}
          checkbox3Checked={checkbox3Checked}
          checkbox4Checked={checkbox4Checked}
          certificationChecked={certificationChecked}
          handleCheckboxChange={handleCheckboxChange}
          handleCertificationCheckboxChange={handleCertificationCheckboxChange}
        />
      )}
      {step > 1 && (
        <Button
          onClick={handlePrevious}
          className="absolute bottom-5 left-5 text-xl hover:cursor-pointer"
        >
          Back
        </Button>
      )}
      {step === 6 && user?.location && user?.location[0] === null ? (
        <>
          {" "}
          <Button
            onClick={handleNext}
            className="absolute bottom-5 right-5 text-xl hover:cursor-pointer"
          >
            Finish
          </Button>
        </>
      ) : (
        <>
          <Button
            onClick={handleNext}
            className="absolute bottom-5 right-5 text-xl hover:cursor-pointer"
          >
            Next
          </Button>
        </>
      )}
      {step === 6 && user?.location && user?.location[0] !== null && (
        <Button
          onClick={handleNext}
          className="absolute bottom-5 right-5 text-xl hover:cursor-pointer"
        >
          Finish
        </Button>
      )}
      {step < 6 && (
        <Button
          onClick={handleNext}
          className="absolute bottom-5 right-5 text-xl hover:cursor-pointer"
        >
          Next
        </Button>
      )}
      {step === 5 && (
        <StepFive
          imageSrc={imageSrc}
          setImageSrc={setImageSrc}
          imageStates={imageStates}
          handleMouseEnter={handleMouseEnter}
          handleMouseLeave={handleMouseLeave}
          handleClick={handleClick}
        />
      )}
      {step === 6 && user?.location && user?.location[0] !== null && (
        <div className={`h-[calc(100vh-138.39px)] md:h-full md:py-20 fade-in`}>
          <div className="flex flex-col">
            <Heading
              title="Add an Address"
              subtitle="You're listing location is approximate on the site and only revealed to indivdual buyers once they've made a purchase"
            />

            {user.location === null ||
            user.location === undefined ||
            ((user.location[0] === null || user.location[0] === undefined) &&
              (user.location[1] === null || user.location[1] === undefined) &&
              (user.location[2] === null || user.location[2] === undefined)) ? (
              <Card
                className={
                  "hover:text-emerald-950 hover:cursor-pointer shadow-sm w/1/2 h-1/2"
                }
                onClick={() => {
                  router.replace("/dashboard/my-store/settings");
                }}
              >
                <CardHeader className="pt-2 sm:pt-6">
                  <div className="text-start">
                    <div className="text-xl sm:text-2xl font-bold">
                      You have no addresses set. Please set this up before
                      creating a listing. Click Here to set up Store Locations
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ) : (
              <div className="flex flex-col lg:flex-row justify-evenly gap-2 pt-4">
                {user.location[0] !== null ? (
                  <Card
                    className={
                      clicked
                        ? "text-emerald-700 hover:cursor-pointer border-[1px] border-emerald-300 shadow-xl"
                        : " hover:text-emerald-950 hover:cursor-pointer shadow-sm w/1/2 h-1/2"
                    }
                    onClick={() => {
                      if (user.location) {
                        setClicked(true);
                        setClicked1(false);
                        setClicked2(false);
                        setValue("location", 0);
                      }
                    }}
                  >
                    <CardHeader className="pt-2 sm:pt-6">
                      <div className="text-start">
                        <div className="text-xl sm:text-2xl font-bold">
                          Use My Default Address
                        </div>
                        <div className="font-light text-neutral-500 mt-2 md:text-xs text-[.7rem]">
                          <ul>
                            <li className={`${outfit.className}`}></li>{" "}
                            {user.location &&
                            user?.location[0]?.address.length === 4 ? (
                              <li className="text-xs">{`${user?.location[0]?.address[0]}, ${user?.location[0]?.address[1]}, ${user?.location[0]?.address[2]}, ${user?.location[0]?.address[3]}`}</li>
                            ) : (
                              <li>Full Address not available</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ) : null}
                {user.location[1] !== null ? (
                  <Card
                    className={
                      clicked1
                        ? "text-emerald-700 hover:cursor-pointer border-[1px] border-emerald-300 shadow-xl"
                        : " hover:text-emerald-950 hover:cursor-pointer shadow-sm w/1/2 h-1/2"
                    }
                    onClick={() => {
                      if (user.location) {
                        setClicked1(true);
                        setClicked(false);
                        setClicked2(false);
                        setValue("location", 1);
                      }
                    }}
                  >
                    <CardHeader className="pt-2 sm:pt-6">
                      <div className="text-start">
                        <div className="text-xl sm:text-2xl font-bold">
                          Use My Second Location
                        </div>
                        <div className="font-light text-neutral-500 mt-2 md:text-xs text-[.7rem]">
                          <ul>
                            <li className={`${outfit.className}`}></li>{" "}
                            {user.location &&
                            user?.location[1]?.address.length === 4 ? (
                              <li className="text-xs">{`${user?.location[1]?.address[0]}, ${user?.location[1]?.address[1]}, ${user?.location[1]?.address[2]}, ${user?.location[1]?.address[3]}`}</li>
                            ) : (
                              <li>Full Address not available</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ) : null}
                {user.location[2] !== null ? (
                  <Card
                    className={
                      clicked2
                        ? "text-emerald-700 hover:cursor-pointer border-[1px] border-emerald-300 shadow-xl"
                        : " hover:text-emerald-950 hover:cursor-pointer shadow-sm w/1/2 h-1/2"
                    }
                    onClick={() => {
                      if (user.location) {
                        setClicked2(true);
                        setClicked1(false);
                        setClicked(false);
                        setValue("location", 2);
                      }
                    }}
                  >
                    <CardHeader className="pt-2 sm:pt-6">
                      <div className="text-start">
                        <div className="text-xl sm:text-2xl font-bold">
                          Use My Third Location
                        </div>
                        <div className="font-light text-neutral-500 mt-2 md:text-xs text-[.7rem]">
                          <ul>
                            <li className={`${outfit.className}`}></li>{" "}
                            {user.location &&
                            user?.location[2]?.address.length === 4 ? (
                              <li className="text-xs">{`${user?.location[2]?.address[0]}, ${user?.location[2]?.address[1]}, ${user?.location[2]?.address[2]}, ${user?.location[2]?.address[3]}`}</li>
                            ) : (
                              <li>Full Address not available</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ) : null}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateClient;
