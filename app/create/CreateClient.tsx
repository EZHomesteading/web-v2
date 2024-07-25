"use client";
//create listing parent client element
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { UserInfo } from "@/next-auth";
import { CiCircleInfo } from "react-icons/ci";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import { Button } from "@/app/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/app/components/ui/breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import axios from "axios";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Emulator from "./components/emulator";
import SearchClient, {
  ProductValue,
} from "@/app/components/client/SearchClient";
import Heading from "@/app/components/Heading";
import Input from "@/app/create/components/listing-input";
import { Label } from "@/app/components/ui/label";
import Counter from "@/app/create/components/Counter";
import { Checkbox } from "@/app/components/ui/checkbox";
import { UploadButton } from "@/utils/uploadthing";
import { Outfit } from "next/font/google";
import Image from "next/image";
import { BsBucket } from "react-icons/bs";
import UnitSelect, { QuantityTypeValue } from "./components/UnitSelect";
import { Textarea } from "@/app/components/ui/textarea";
import { Card, CardHeader } from "../components/ui/card";
import { addDays, format } from "date-fns";
import Help from "./components/help";
import InputField from "./components/suggestion-input";
import { FinalListing } from "@/actions/getListings";
import { CheckedState } from "@radix-ui/react-checkbox";
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
  const [step, setStep] = useState(index);
  const [quantityType, setQuantityType] = useState<QuantityTypeValue>();
  const [product, setProduct] = useState<ProductValue>();
  const router = useRouter();
  const [clicked, setClicked] = useState(false);
  const [clicked1, setClicked1] = useState(false);
  const [clicked2, setClicked2] = useState(false);

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
      stock: 1,
      quantityType: "",
      imageSrc: [],
      price: 1,
      title: "",
      description: "",
      shelfLifeDays: 0,
      shelfLifeWeeks: 0,
      shelfLifeMonths: 0,
      shelfLifeYears: 0,
      rating: [],
      minOrder: 1,
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
  const imageSrc = watch("imageSrc");
  const minOrder = watch("minOrder");
  const quantity = watch("stock");
  const price = watch("price");
  const sodt = watch("sodt");

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

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

  const [description, setDescription] = useState("");
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
      title: data.title,
      SODT: parseInt(data.sodt),
      minOrder: parseInt(data.minOrder),
      description: description,
      category: data.category,
      subCategory: data.subCategory,
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
        setProduct(undefined);
        setRating([]);
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
  //step handlers so that proper pages render
  const handleNext = async () => {
    if (step === 1 && !product) {
      toast.error("Let us know what produce you have!", {
        duration: 2000,
        position: "bottom-center",
      });
      return;
    }

    if (step === 1 && !description) {
      toast.error("Please write a brief description", {
        duration: 2000,
        position: "bottom-center",
      });
      return;
    }

    if (step === 2 && !quantityType) {
      toast.error("Please enter a unit for your listing", {
        duration: 2000,
        position: "bottom-center",
      });
      return;
    }
    if (step === 2 && minOrder > quantity) {
      toast.error("Minimum order cannot be more than your quantity", {
        duration: 2000,
        position: "bottom-center",
      });
      return;
    }
    if (step === 2 && !sodt) {
      toast.error("Please enter a set out/delivery time for your listing", {
        duration: 2000,
        position: "bottom-center",
      });
      return;
    }

    if (step === 2 && (quantity <= 0 || !quantity)) {
      toast.error("Quantity must be greater than 0", {
        duration: 2000,
        position: "bottom-center",
      });
      return;
    }

    if (step === 4 && Array.isArray(imageSrc) && imageSrc.length === 0) {
      toast.error("Please use the stock photo or upload atleast one photo", {
        duration: 2000,
        position: "bottom-center",
      });
      return;
    }

    if (step === 3 && !certificationChecked) {
      toast.error("You must certify that the above information is accurate.", {
        duration: 2000,
        position: "bottom-center",
      });
      return;
    }

    if (
      step === 2 &&
      shelfLifeDays <= 0 &&
      shelfLifeWeeks <= 0 &&
      shelfLifeMonths <= 0 &&
      shelfLifeYears <= 0
    ) {
      toast.error("Shelf life must be at least 1 day", {
        duration: 2000,
        position: "bottom-center",
      });
      return;
    }

    if (step === 2 && (price <= 0 || !price)) {
      toast.error("Please enter a price greater than 0.", {
        duration: 2000,
        position: "bottom-center",
      });
      return;
    }
    if (step === 2 && (minOrder <= 0 || !quantity)) {
      toast.error("Please enter a minimum order greater than 0.", {
        duration: 2000,
        position: "bottom-center",
      });
      return;
    }
    if (
      step === 5 ||
      (step === 4 && user?.location && user?.location[0] === null)
    ) {
      if (!product) {
        toast.error("Let us know what produce you have!", {
          duration: 2000,
          position: "bottom-right",
        });
        return;
      } else if (!description) {
        toast.error("Please write a brief description", {
          duration: 2000,
          position: "bottom-center",
        });
        return;
      } else if (!quantityType) {
        toast.error("Please enter a unit for your listing", {
          duration: 2000,
          position: "bottom-center",
        });
        return;
      } else if (!sodt) {
        toast.error("Please enter a set out/delivery time for your listing", {
          duration: 2000,
          position: "bottom-center",
        });
        return;
      } else if (quantity <= 0 || !quantity) {
        toast.error("Quantity must be greater than 0", {
          duration: 2000,
          position: "bottom-center",
        });
        return;
      } else if (minOrder > quantity) {
        toast.error("Minimum order cannot be more than your quantity", {
          duration: 2000,
          position: "bottom-center",
        });
        return;
      } else if (minOrder <= 0 || !quantity) {
        toast.error("Please enter a minimum order greater than 0.", {
          duration: 2000,
          position: "bottom-center",
        });
        return;
      } else if (Array.isArray(imageSrc) && imageSrc.length === 0) {
        toast.error("Please use the stock photo or upload at least one photo", {
          duration: 2000,
          position: "bottom-center",
        });
        return;
      } else if (Array.isArray(rating) && rating.length === 0) {
        toast.error("Please certify your EZH Organic Rating", {
          duration: 2000,
          position: "bottom-center",
        });
        return;
      } else if (
        shelfLifeDays <= 0 &&
        shelfLifeWeeks <= 0 &&
        shelfLifeMonths <= 0 &&
        shelfLifeYears <= 0
      ) {
        toast.error("Shelf life must be at least 1 day", {
          duration: 2000,
          position: "bottom-center",
        });
        return;
      } else if (price <= 0 || !quantity) {
        toast.error("Please enter a price greater than 0.", {
          duration: 2000,
          position: "bottom-center",
        });
        return;
      } else if (user?.location && user?.location[0] === null) {
        toast.error("Please Set a default location in your store settings", {
          duration: 2000,
          position: "bottom-center",
        });
        return;
      }
    }
    if (step === 5) {
      handleSubmit(onSubmit)();
    } else if (step === 4 && user?.location && user?.location[0] === null) {
      handleSubmit(onSubmit)();
    } else {
      setStep(step + 1);
    }
  };
  const handlePrevious = () => {
    setStep(step - 1);
  };

  useEffect(() => {
    if (quantity <= 0) {
      setValue("stock", 1);
    }
    if (minOrder <= 0) {
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
  const [suggestionName, setSuggestionName] = useState("");
  const [suggestionCategory, setSuggestionCategory] = useState("");
  const [suggestionSubCategory, setSuggestionSubCategory] = useState("");
  const handleSuggestionSubmit = () => {
    const body = {
      name: suggestionName,
      subCategory: suggestionSubCategory,
      category: suggestionCategory,
    };
    try {
      axios.post("/api/useractions/suggestion", body);
      toast.success("Your request has been recieved!");
      setSuggestionCategory("");
      setSuggestionName("");
      setSuggestionSubCategory("");
    } catch (error) {
      toast.error("an error occured");
    }
  };

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
  const handlenonPerishableCheckboxChange = (
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
  return (
    <div className={`${outfit.className} relative w-full`}>
      <div className="absolute top-2 right-2 md:left-2">
        <Help role={user.role} step={step} />
      </div>
      <div className="flex flex-col md:flex-row text-black w-full">
        <div className="onboard-left md:w-2/5 md:min-h-screen">
          <div className="flex flex-col items-start pl-6 py-5 md:pt-20 md:pb-2">
            <h2 className="tracking font-medium 2xl:text-2xl text-lg tracking-tight md:pt-[20%]">
              List Your Excess Produce
            </h2>
            {step === 1 && (
              <div className="flex flex-row fade-in">
                <div className="2xl:text-4xl text-lg font-bold tracking-tight">
                  First, let&apos;s go over the basics
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="flex flex-row items-center fade-in">
                {" "}
                <div className="2xl:text-4xl text-lg font-bold tracking-tight">
                  Next, Provide Some General Info
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="flex flex-col items-start fade-in">
                <div className="flex flex-row">
                  <div className="2xl:text-4xl text-lg font-bold tracking-tightt">
                    Tell us how you grow your produce
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button className="shadow-none bg-transparent hover:bg-transparent text-black">
                        <CiCircleInfo className="lg:text-4xl" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className={`${outfit.className} popover xl:absolute xl:bottom-10`}
                    >
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            EZHomesteading will randomly & anonymously purchase
                            goods from sellers to test the validity of
                            certifications & promote consumer confidence
                          </p>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="flex flex-col items-start fade-in">
                <div className="flex flex-row">
                  <div className="2xl:text-4xl text-lg font-bold tracking-tightt">
                    You're Almost Done, We Just Need Some Pictures
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button className="shadow-none bg-transparent hover:bg-transparent text-black">
                        <CiCircleInfo className="lg:text-4xl" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="popover xl:absolute xl:bottom-10">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            EZHomesteading reccomends that Producers upload at
                            least one photo of their actual product.
                          </p>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="shadow-none bg-transparent hover:bg-transparent text-black m-0 p-0 text-xs">
                  Feel free to include, only use, or get rid of the stock photo
                </div>
              </div>
            )}
            {step === 5 && user?.location && user?.location[0] !== null && (
              <div className="flex flex-col items-start fade-in">
                <div className="flex flex-row">
                  <div className="2xl:text-4xl text-lg font-bold tracking-tight">
                    Where is your farm or garden located?
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button className="shadow-none bg-transparent hover:bg-transparent text-black">
                        <CiCircleInfo className="lg:text-4xl" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="popover xl:absolute xl:bottom-10">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            EZHomesteading uses data provided by you to generate
                            the default location. We do not track your location
                            unless you have given us permission.
                          </p>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="shadow-none bg-transparent hover:bg-transparent text-black m-0 p-0 text-xs">
                  Help local consumers find you!
                </div>
              </div>
            )}
            <Breadcrumb className={`${outfit.className} text-black pt-1 z-10 `}>
              <BreadcrumbList className="text-[.6rem]">
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem
                  className={
                    step === 1
                      ? "font-bold cursor-none"
                      : "font-normal cursor-pointer"
                  }
                  onMouseDown={() => setStep(1)}
                >
                  General
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem
                  className={
                    step === 2
                      ? "font-bold cursor-none"
                      : "font-normal cursor-pointer"
                  }
                  onMouseDown={() => setStep(2)}
                >
                  Specifics
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem
                  className={
                    step === 3
                      ? "font-bold cursor-none "
                      : "font-normal cursor-pointer"
                  }
                  onMouseDown={() => setStep(3)}
                >
                  Rating
                </BreadcrumbItem>
                <BreadcrumbSeparator />

                <BreadcrumbItem
                  className={
                    step === 4
                      ? "font-bold cursor-none "
                      : "font-normal cursor-pointer"
                  }
                  onMouseDown={() => setStep(4)}
                >
                  Photos
                </BreadcrumbItem>
                {user?.location && user?.location[0] !== null && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem
                      className={
                        step === 5
                          ? "font-bold cursor-none "
                          : "font-normal cursor-pointer"
                      }
                      onMouseDown={() => {
                        if (!product) {
                          toast.error("Let us know what produce you have!", {
                            duration: 2000,
                            position: "bottom-center",
                          });
                          return;
                        } else if (!description) {
                          toast.error("Please write a brief description", {
                            duration: 2000,
                            position: "bottom-center",
                          });
                          return;
                        } else if (!quantityType) {
                          toast.error("Please enter a unit for your listing", {
                            duration: 2000,
                            position: "bottom-center",
                          });
                          return;
                        } else if (quantity <= 0 || !quantity) {
                          toast.error("Quantity must be greater than 0", {
                            duration: 2000,
                            position: "bottom-center",
                          });
                          return;
                        } else if (minOrder <= 0 || !quantity) {
                          toast.error(
                            "Please enter a minimum order greater than 0.",
                            {
                              duration: 2000,
                              position: "bottom-center",
                            }
                          );
                          return;
                        } else if (
                          Array.isArray(imageSrc) &&
                          imageSrc.length === 0
                        ) {
                          toast.error(
                            "Please use the stock photo or upload at least one photo",
                            {
                              duration: 2000,
                              position: "bottom-center",
                            }
                          );
                          return;
                        } else if (
                          shelfLifeDays <= 0 &&
                          shelfLifeWeeks <= 0 &&
                          shelfLifeMonths <= 0 &&
                          shelfLifeYears <= 0
                        ) {
                          toast.error("Shelf life must be at least 1 day", {
                            duration: 2000,
                            position: "bottom-center",
                          });
                          return;
                        } else if (price <= 0 || !quantity) {
                          toast.error("Please enter a price greater than 0.", {
                            duration: 2000,
                            position: "bottom-center",
                          });
                          return;
                        } else if (minOrder > quantity) {
                          toast.error(
                            "Minimum order cannot be higher than stock.",
                            {
                              duration: 2000,
                              position: "bottom-center",
                            }
                          );
                          return;
                        } else if (
                          Array.isArray(rating) &&
                          rating.length === 0
                        ) {
                          toast.error(
                            "Please certify your EZH Organic Rating",
                            {
                              duration: 2000,
                              position: "bottom-center",
                            }
                          );
                          return;
                        } else {
                          setStep(5);
                        }
                      }}
                    >
                      Location
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="hidden emulator-container mt-8">
            <div className="sticky bottom-0 left-0 right-0 px-6">
              <Emulator
                product={product as unknown as FinalListing & { label: string }}
                description={description}
                stock={quantity}
                quantityType={quantityType}
                price={price}
                imageSrc={imageSrc}
                user={user}
                shelfLife={
                  shelfLifeDays +
                  shelfLifeWeeks * 7 +
                  shelfLifeMonths * 30 +
                  shelfLifeYears * 365
                }
                city={user.location ? user?.location[0]?.address[1] : "Norfolk"}
                state={user.location ? user?.location[0]?.address[2] : "VA"}
              />
            </div>
          </div>
        </div>

        <div className="md:w-3/5 onboard-right relative">
          <div className=" mx-[5%] md:py-20">
            {step === 1 && (
              <div className="flex flex-col gap-5 p-[1px] h-[calc(100vh-114.39px)] md:h-full fade-in">
                <div className="flex md:flex-row md:items-center md:justify-between w-full flex-col items-start">
                  <Heading
                    title="Provide a name and description"
                    subtitle="Max length of 300 characters for description"
                  />
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="bg-slate-500 shadow-sm p-2 rounded-full text-white text-xs">
                        Suggest a new Listing
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Propose a new Listing</DialogTitle>
                        <DialogDescription>
                          Please enter a title, category and brief keyword
                          description
                        </DialogDescription>
                      </DialogHeader>
                      <ul className="">
                        <li>
                          <InputField
                            id="suggestionName"
                            placeholder="Name"
                            value={suggestionName}
                            onChange={setSuggestionName}
                          />
                        </li>
                        <li>
                          <InputField
                            id="suggestionCategory"
                            placeholder="Category"
                            value={suggestionCategory}
                            onChange={setSuggestionCategory}
                          />
                        </li>
                        <li>
                          <InputField
                            id="suggestionSubCategory"
                            placeholder="Sub Category"
                            value={suggestionSubCategory}
                            onChange={setSuggestionSubCategory}
                          />
                        </li>
                      </ul>
                      <DialogTrigger onClick={handleSuggestionSubmit}>
                        <div className="px-3">Submit</div>
                      </DialogTrigger>
                    </DialogContent>
                  </Dialog>
                </div>
                <div>
                  <SearchClient
                    value={product}
                    onChange={(value) => {
                      setProduct(value as ProductValue);
                      setValue("title", value?.label);
                      setValue("category", value?.category);
                      setValue("imageSrc[0]", value?.photo);
                      setValue("subCategory", value?.cat);
                    }}
                  />
                </div>
                <hr />
                <Textarea
                  id="description"
                  placeholder="It's reccomended to include key information about your listing in the description. This will help the algorithm when users search"
                  disabled={isLoading}
                  className="h-[30vh] shadow-md text-[14px] bg"
                  maxLength={500}
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                />
              </div>
            )}
            {step === 2 && (
              <div className="flex flex-col gap-4 h-[calc(100vh-114.39px)] md:h-full fade-in">
                <div className={`text-start`}>
                  <div className="text-xl sm:text-2xl font-bold">
                    Add Quantity, Shelf Life, and Units
                  </div>
                  <div className="font-light text-neutral-500 mt-2 md:text-xs text-[.5rem]">
                    Not worth your time for someone to order less than a certain
                    amount of this item? Set a minimum order requirement, or
                    leave it at 1
                  </div>
                </div>
                <div className="flex flex-col justify-center items-start gap-2">
                  <div className="w-full xl:w-2/3">
                    <div className="flex flex-row gap-2">
                      <div className="w-1/2">
                        <Input
                          id="stock"
                          label="Quantity"
                          type="number"
                          disabled={isLoading}
                          register={register}
                          errors={errors}
                          watch={watch}
                          setValue={setValue}
                          maxlength={6}
                        />{" "}
                      </div>
                      <div className="w-1/2">
                        <UnitSelect
                          value={quantityType}
                          onChange={(value) => {
                            setQuantityType(value as QuantityTypeValue);
                            setValue("quantityType", value?.value);
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex flex-row gap-2 mt-2">
                      <div className="w-1/2">
                        <Input
                          id="price"
                          label="Price per unit"
                          type="number"
                          step="0.01"
                          disabled={isLoading}
                          register={register}
                          errors={errors}
                          formatPrice
                          watch={watch}
                          setValue={setValue}
                          maxlength={6}
                        />
                      </div>
                      <div className="w-1/2">
                        <Input
                          id="minOrder"
                          label="Minimum order"
                          type="number"
                          disabled={isLoading}
                          register={register}
                          errors={errors}
                          watch={watch}
                          setValue={setValue}
                          maxlength={4}
                        />
                      </div>
                    </div>
                    <div className="m-0 p-0 md:mb-3 mt-5 border-black border-[1px] w-full"></div>

                    <div className="w-full">
                      <div className="flex flex-col gap-2 mt-2">
                        <Label className="text-xl w-full">
                          Time to Prepare an Order
                        </Label>

                        <Select
                          onValueChange={(value: string) => {
                            setValue("sodt", value);
                          }}
                        >
                          <div className="flex flex-col items-start gap-y-3">
                            <SelectTrigger className="w-fit h-1/6 bg-slate-300 text-black text-xl">
                              {usersodt ? (
                                <SelectValue
                                  placeholder={`${usersodt} Minutes `}
                                />
                              ) : (
                                <SelectValue placeholder={"Select a Time"} />
                              )}
                            </SelectTrigger>
                            {!user?.SODT && sodt !== null && (
                              <Checkbox
                                id="saveAsDefault"
                                checked={postSODT}
                                onCheckedChange={(checked: boolean) =>
                                  handleSODTCheckboxChange(checked, 0)
                                }
                                label="Save as Account Default"
                              />
                            )}
                          </div>
                          <SelectContent
                            className={`${outfit.className} bg-slate-300`}
                          >
                            <SelectGroup>
                              <SelectItem value="15">15 Minutes</SelectItem>
                              <SelectItem value="30">30 Minutes</SelectItem>
                              <SelectItem value="45">45 Minutes</SelectItem>
                              <SelectItem value="60">1 Hour</SelectItem>
                              <SelectItem value="75">
                                1 Hour 15 Minutes
                              </SelectItem>
                              <SelectItem value="90">
                                1 Hour 30 Minutes
                              </SelectItem>
                              <SelectItem value="105">
                                1 Hour 45 Minutes
                              </SelectItem>
                              <SelectItem value="120">2 Hours</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <div className="m-0 p-0 md:mb-3 mt-5 border-black border-[1px] w-full xl:w-2/3"></div>
                  <div className="w-full lg:w-1/2">
                    <div className="flex flex-col lg:flex-row items-start justify-between w-[50vw] lg:items-center ">
                      <Label className="text-xl">Estimated Shelf Life </Label>
                      <Checkbox
                        id="nonPerishable"
                        checked={nonPerishable}
                        onCheckedChange={(checked: boolean) =>
                          handlenonPerishableCheckboxChange(checked, 0)
                        }
                        label="Is this item non-perishble?"
                      />
                    </div>
                    {nonPerishable === false ? (
                      <div>
                        <div className="text-xs">
                          {shelfLife ? (
                            <>Estimated Expiry Date: {expiryDate}</>
                          ) : (
                            <></>
                          )}
                        </div>
                        <div className="mt-1 space-y-2">
                          <Counter
                            onChange={(value: number) =>
                              setCustomValue("shelfLifeDays", value)
                            }
                            value={shelfLifeDays}
                            title="Days"
                            subtitle=""
                            maximum={31}
                          />
                          <Counter
                            onChange={(value: number) =>
                              setCustomValue("shelfLifeWeeks", value)
                            }
                            value={shelfLifeWeeks}
                            title="Weeks"
                            subtitle=""
                            maximum={4}
                          />
                          <Counter
                            onChange={(value: number) =>
                              setCustomValue("shelfLifeMonths", value)
                            }
                            value={shelfLifeMonths}
                            title="Months"
                            subtitle=""
                            maximum={12}
                          />
                          <Counter
                            onChange={(value: number) =>
                              setCustomValue("shelfLifeYears", value)
                            }
                            value={shelfLifeYears}
                            title="Years"
                            subtitle=""
                            maximum={50}
                          />
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            )}
            {step === 3 && (
              <div
                className={`flex flex-col gap-4 h-[calc(100vh-122.39px)] md:h-full fade-in`}
              >
                <div className={`text-start`}>
                  <div className="text-xl sm:text-2xl font-bold">
                    Help Us Keep EZHomesteading Honestly Organic
                  </div>
                  <div className="font-light text-neutral-500 mt-2 md:text-xs text-[.7rem]">
                    Your base score is one, only check the boxes if they are
                    accurate
                  </div>
                </div>
                <div className="flex flex-col gap-y-2">
                  <div className="flex flex-row gap-x-2 items-center">
                    <Checkbox
                      checked={checkbox1Checked}
                      onCheckedChange={(checked: boolean) =>
                        handleCheckboxChange(checked, 0)
                      }
                    />
                    <Label>This produce is not genetically modified</Label>
                  </div>
                  <div className="flex flex-row gap-x-2 items-center">
                    <Checkbox
                      checked={checkbox2Checked}
                      onCheckedChange={(checked: boolean) =>
                        handleCheckboxChange(checked, 1)
                      }
                    />
                    <Label>
                      This produce was not grown with inorganic fertilizers
                    </Label>
                  </div>
                  <div className="flex flex-row gap-x-2 items-center">
                    <Checkbox
                      checked={checkbox3Checked}
                      onCheckedChange={(checked: boolean) =>
                        handleCheckboxChange(checked, 2)
                      }
                    />
                    <Label>
                      This produce was not grown with inorganic pestacides
                    </Label>
                  </div>
                  <div className="flex flex-row gap-x-2 items-center">
                    <Checkbox
                      checked={checkbox4Checked}
                      onCheckedChange={(checked: boolean) =>
                        handleCheckboxChange(checked, 3)
                      }
                    />
                    <Label>This produce was not modified after harvest</Label>
                  </div>
                  <div className="flex flex-row gap-x-2 font-extrabold items-center">
                    <Checkbox
                      checked={certificationChecked}
                      onCheckedChange={(checked: boolean) =>
                        handleCertificationCheckboxChange(checked)
                      }
                    />
                    <Label className="font-bold">
                      I certify that all of the above information is accurate
                    </Label>
                  </div>
                </div>
              </div>
            )}
            {step > 1 && (
              <Button
                onClick={handlePrevious}
                className="absolute bottom-5 left-5 text-xl hover:cursor-pointer"
              >
                Back
              </Button>
            )}
            {step === 5 && user?.location && user?.location[0] === null ? (
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
                {" "}
                <Button
                  onClick={handleNext}
                  className="absolute bottom-5 right-5 text-xl hover:cursor-pointer"
                >
                  Next
                </Button>
              </>
            )}
            {step === 5 && user?.location && user?.location[0] !== null && (
              <Button
                onClick={handleNext}
                className="absolute bottom-5 right-5 text-xl hover:cursor-pointer"
              >
                Finish
              </Button>
            )}
            {step < 5 && (
              <Button
                onClick={handleNext}
                className="absolute bottom-5 right-5 text-xl hover:cursor-pointer"
              >
                Next
              </Button>
            )}
            {step === 4 && (
              <div
                className={`${outfit.className} flex flex-col gap-8 items-stretch h-screen md:h-full fade-in`}
              >
                <Heading
                  title="Take or Add Photos of your Product"
                  subtitle="Actual photos are preferred over images from the web, click upload image to capture or add a photo"
                />
                <div className="flex flex-col sm:flex-row gap-x-2 gap-y-2 items-center justify-center  ">
                  {[...Array(3)].map((_, index) => (
                    <div
                      key={index}
                      className={`relative h-40 sm:h-60 w-48 transition-transform duration-300 rounded-xl ${
                        imageStates[index].isHovered
                          ? "transform shadow-xl"
                          : ""
                      } ${imageStates[index].isFocused ? "z-10" : "z-0"}`}
                      onMouseEnter={() => handleMouseEnter(index)}
                      onMouseLeave={() => handleMouseLeave(index)}
                      onClick={() => handleClick(index)}
                    >
                      {watch(`imageSrc[${index}]`) ? (
                        <>
                          <Image
                            src={watch(`imageSrc[${index}]`)}
                            fill
                            alt={`Listing Image ${index + 1}`}
                            className="object-cover rounded-xl"
                          />
                          <button
                            className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md"
                            onClick={(e) => {
                              e.stopPropagation();
                              const newImageSrc = [...watch("imageSrc")];
                              newImageSrc.splice(index, 1);
                              setValue("imageSrc", newImageSrc);
                            }}
                          >
                            <BsBucket />
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center justify-center rounded-xl border-dashed border-2 border-black h-full bg">
                          {" "}
                          <UploadButton
                            endpoint="imageUploader"
                            onClientUploadComplete={(
                              res: { url: string }[]
                            ) => {
                              const newImageSrc = [...watch("imageSrc")];
                              const emptyIndex = newImageSrc.findIndex(
                                (src) => !src
                              );
                              if (emptyIndex !== -1) {
                                newImageSrc[emptyIndex] = res[0].url;
                              } else {
                                newImageSrc.push(res[0].url);
                              }
                              setValue("imageSrc", newImageSrc);
                            }}
                            onUploadError={(error: Error) => {
                              alert(`ERROR! ${error.message}`);
                            }}
                            appearance={{
                              container: "h-full w-max",
                            }}
                            className="ut-allowed-content:hidden ut-button:bg-transparent ut-button:text-black ut-button:w-[160px] ut-button:sm:w-[240px] ut-button:px-2 ut-button:h-full"
                            content={{
                              button({ ready }) {
                                if (ready) return <div>Upload Image</div>;
                                return "Getting ready...";
                              },
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {step === 5 && user?.location && user?.location[0] !== null && (
              <div
                className={`h-[calc(100vh-138.39px)] md:h-full md:py-20 fade-in`}
              >
                <div className="flex flex-col">
                  <Heading
                    title="Add an Address"
                    subtitle="You're listing location is approximate on the site and only revealed to indivdual buyers once they've made a purchase"
                  />

                  {user.location === null ||
                  user.location === undefined ||
                  ((user.location[0] === null ||
                    user.location[0] === undefined) &&
                    (user.location[1] === null ||
                      user.location[1] === undefined) &&
                    (user.location[2] === null ||
                      user.location[2] === undefined)) ? (
                    <Card
                      className={
                        "hover:text-emerald-950 hover:cursor-pointer bg shadow-sm w/1/2 h-1/2"
                      }
                      onClick={() => {
                        router.replace("/dashboard/my-store/settings");
                      }}
                    >
                      <CardHeader className="pt-2 sm:pt-6">
                        <div className="text-start">
                          <div className="text-xl sm:text-2xl font-bold">
                            You have no addresses set. Please set this up before
                            creating a listing. Click Here to set up Store
                            Locations
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
                              ? "text-emerald-700 hover:cursor-pointer border-[1px] border-emerald-300 bg shadow-xl"
                              : " hover:text-emerald-950 hover:cursor-pointer bg shadow-sm w/1/2 h-1/2"
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
                              ? "text-emerald-700 hover:cursor-pointer border-[1px] border-emerald-300 bg shadow-xl"
                              : " hover:text-emerald-950 hover:cursor-pointer bg shadow-sm w/1/2 h-1/2"
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
                              ? "text-emerald-700 hover:cursor-pointer border-[1px] border-emerald-300 bg shadow-xl"
                              : " hover:text-emerald-950 hover:cursor-pointer bg shadow-sm w/1/2 h-1/2"
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
        </div>
      </div>
    </div>
  );
};

export default CreateClient;
