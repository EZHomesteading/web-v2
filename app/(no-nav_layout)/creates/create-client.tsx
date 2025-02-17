"use client";
import { OutfitFont } from "@/components/fonts";
import Alert from "@/components/ui/custom-alert";
import { cn } from "@/lib/utils";
import { Location } from "@prisma/client";
import { UserInfo } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { CiApple, CiHome } from "react-icons/ci";
import { GiRopeCoil } from "react-icons/gi";
import { LuBeef } from "react-icons/lu";
import { PiArrowRight } from "react-icons/pi";

type ListingFormData = {
  title: string;
  category: string;
  subCategory: string;
  stock: number;
  quantityType: string;
  price: number;
  description: string;
  minOrder: number;
  imageSrc: string[];
  shelfLife: number;
  SODT: number;
  projectedStock?: number;
  harvestFeatures?: boolean;
  harvestDates?: string[];
  keyWords: string[];
  harvestType?: string;
};

const initialFormData: ListingFormData = {
  title: "",
  category: "",
  subCategory: "",
  stock: 0,
  quantityType: "",
  price: 0,
  description: "",
  minOrder: 1,
  imageSrc: [],
  SODT: 0,
  shelfLife: 0,
  keyWords: [],
};

export default function CreateClient({
  locs,
  defaultLoc,
  user,
}: {
  user?: UserInfo;
  locs: Location[];
  defaultLoc?: Location;
}) {
  const [step, setStep] = useState(1);
  const [selectedLoc, setSelectedLoc] = useState<Location | undefined>(
    defaultLoc
  );
  const [formData, setFormData] = useState<ListingFormData>(initialFormData);

  const updateFormData = (field: keyof ListingFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <LocationStep
            locs={locs}
            selectedLoc={selectedLoc}
            setSelectedLoc={setSelectedLoc}
          />
        );
      case 2:
        return (
          <CategoryStep formData={formData} updateFormData={updateFormData} />
        );
      case 3:
        return (
          <SubCategoryStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 4:
        return (
          <DetailsStep formData={formData} updateFormData={updateFormData} />
        );
      case 5:
        return (
          <QualitiesStep formData={formData} updateFormData={updateFormData} />
        );
      case 6:
        return (
          <ShelfLifeStep formData={formData} updateFormData={updateFormData} />
        );
      case 7:
        return (
          <RatingStep formData={formData} updateFormData={updateFormData} />
        );
      case 8:
        return (
          <ImagesStep formData={formData} updateFormData={updateFormData} />
        );
      default:
        return null;
    }
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }
    try {
    } catch (error) {
      console.error(error);
    }
  };

  const validate = () => {
    return true;
  };

  return (
    <div className={`relative min-h-screen ${OutfitFont.className}`}>
      <Header loc={selectedLoc} />

      <div className="absolute top-20 bottom-20 left-0 right-0">
        <div className="h-full flex flex-col justify-center items-center md:my-16">
          <div className="overflow-y-auto bg-white min-h-full sm:px-20 px-6 pb-12 md:pb-0 max-w-6xl md:my-16 flex items-center w-full flex-col">
            {renderStep()}
          </div>
        </div>
      </div>

      <Footer
        step={step}
        setStep={setStep}
        canProceed={validate()}
        onSubmit={handleSubmit}
        isLastStep={step === 7}
        formData={formData}
      />
    </div>
  );
}

const LocationStep = ({
  locs,
  setSelectedLoc,
  selectedLoc,
}: {
  locs: Location[];
  setSelectedLoc: Dispatch<SetStateAction<Location | undefined>>;
  selectedLoc?: Location;
}) => {
  return (
    <div className="fade-in flex flex-col items-center w-full">
      {locs && locs.length >= 1 ? (
        <>
          <Heading
            title="Set a Selling Location"
            subtitle="Where are you selling this listing from?"
          />
          <section className={`flex flex-col gap-y-3 w-full max-w-lg`}>
            {locs.map((loc: Location) => (
              <button
                className={`w-full border !border-k relative h-24 rounded-sm shadow-md ${
                  selectedLoc?.id === loc?.id && "bg-black text-white"
                }`}
                onClick={() => {
                  setSelectedLoc(loc);
                }}
                key={loc?.id}
              >
                {loc?.displayName ? (
                  <div>
                    <p className={`text-base font-medium `}>
                      {loc?.displayName}
                    </p>
                    <p className={`text-xs text-neutral-700 font-medium`}>
                      {loc?.address[0]}
                    </p>
                  </div>
                ) : (
                  <p className={`text-base font-medium `}>{loc?.address[0]}</p>
                )}
              </button>
            ))}
            {locs?.length < 5 && (
              <Link
                href={`/new-location-and-hours`}
                className={`text-gray-500 w-full border !border-k relative py-8 rounded-sm shadow-md text-base font-medium text-center
            `}
              >
                Create New Selling Location
              </Link>
            )}
          </section>
        </>
      ) : (
        <div>
          <p className={` max-w-sm text-center text-sm`}>
            You have no elidgable selling locations. This occurs when you have
            no locations that are marked for selling or no locations in general.
            Creating a selling location is free and takes only a couple of
            minutes.
          </p>
          <Link
            href={`/new-location-and-hours`}
            className={`items-center border p-4 shadow-md text-base sm:text-xl group font-medium rounded-full flex justify-between !border-black absolute top-1/3 right-1/2 transform translate-x-1/2 w-full max-w-[350px]`}
          >
            Create a new Selling Location
            <PiArrowRight
              className={`text-xl ml-3 hover:translate-x-3  duration-300 group-hover:translate-x-2`}
            />
          </Link>
          <Link
            href={`/`}
            className={`absolute top-[43%] right-1/2 transform translate-x-1/2 underline`}
          >
            Home
          </Link>
        </div>
      )}
    </div>
  );
};

const CategoryStep = ({
  formData,
  updateFormData,
}: {
  formData: ListingFormData;
  updateFormData: (field: keyof ListingFormData, value: any) => void;
}) => {
  type Category = {
    icon: ReactNode;
    title: string;
    description: string;
    value: string;
  };
  const categories: Category[] = [
    {
      icon: <CiApple size={40} />,
      title: "Unprocessed Produce",
      description: "Apples, Peaches & Tomatoes",
      value: "unprocessed-produce",
    },
    {
      icon: <CiHome size={40} />,
      title: "Homemade",
      description: "Apple Pie & Beeswax Candles",
      value: "homemade",
    },
    {
      icon: <GiRopeCoil size={40} />,
      title: "Durables",
      description: "Canned Food & Solar Panels",
      value: "durables",
    },
    {
      icon: <LuBeef size={40} />,
      title: "Dairy & Meat",
      description: "Milk Shares & Free-Range Chicken",
      value: "dairy-meat",
    },
  ];
  return (
    <div className="fade-in flex flex-col items-center w-full">
      <Heading
        title="Select a Category"
        subtitle="Which of these best describes your listing"
      />
      {categories.map((category: Category) => (
        <CategoryCard
          key={category.value}
          icon={category.icon}
          title={category.title}
          description={category.description}
          onClick={() => updateFormData("category", category.value)}
          className={`${
            formData.category === category.value && "bg-black text-white"
          }`}
        />
      ))}
    </div>
  );
};

const CategoryCard = ({
  icon,
  title,
  description,
  onClick,
  className,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
  className?: string;
}) => (
  <button
    className={cn(
      "max-w-xl w-full h-28 py-2 hover:cursor-pointer shadow-md hover:!border-black rounded-md border px-3 mb-3",
      className
    )}
    onClick={onClick}
  >
    <div className="h-full rounded-md flex flex-row items-center justify-between space-x-2">
      <div className="flex flex-col items-start">
        <div className="text-lg font-normal">{title}</div>
        <div className="text-sm text-gray-600 font-light">{description}</div>
      </div>
      <div className="flex-shrink-0">{icon}</div>
    </div>
  </button>
);

const SubCategoryStep = ({
  formData,
  updateFormData,
}: {
  formData: ListingFormData;
  updateFormData: (field: keyof ListingFormData, value: any) => void;
}) => {
  return (
    <div className="fade-in flex flex-col items-center w-full">
      <Heading
        title="Select a Subcategory"
        subtitle="Which of these best describes your listing"
      />
    </div>
  );
};

const DetailsStep = ({
  formData,
  updateFormData,
}: {
  formData: ListingFormData;
  updateFormData: (field: keyof ListingFormData, value: any) => void;
}) => {
  return <></>;
};

const QualitiesStep = ({
  formData,
  updateFormData,
}: {
  formData: ListingFormData;
  updateFormData: (field: keyof ListingFormData, value: any) => void;
}) => {
  return <></>;
};

const ShelfLifeStep = ({
  formData,
  updateFormData,
}: {
  formData: ListingFormData;
  updateFormData: (field: keyof ListingFormData, value: any) => void;
}) => {
  return <></>;
};

const RatingStep = ({
  formData,
  updateFormData,
}: {
  formData: ListingFormData;
  updateFormData: (field: keyof ListingFormData, value: any) => void;
}) => {
  return <></>;
};

const ImagesStep = ({
  formData,
  updateFormData,
}: {
  formData: ListingFormData;
  updateFormData: (field: keyof ListingFormData, value: any) => void;
}) => {
  return <></>;
};

const Header = ({ loc }: { loc?: Location }) => {
  const router = useRouter();
  return (
    <div className="fixed top-0 left-0 right-0 h-20 bg-white z-10 text-black text-center">
      <div className={`flex items-center justify-between px-6`}>
        <Alert
          icon={
            <Image
              src="/images/website-images/ezh-logo-no-text.png"
              alt={`EZH`}
              width={45}
              height={45}
            />
          }
          alertTriggerClassName="bg-white border-none h-fit w-fit"
          subtitleClassName="mt-6 px-2"
          alertContentClassName=""
          headingText="Are you sure?"
          onClick={() => {
            router.push("/");
          }}
          subtitleText="If you leave this page & return home, you will lose your progress creating this listing."
          confirmButtonText="I'm Sure"
          cancelButtonText="Cancel"
          cancelButtonClassName="hover:text-black"
          confirmButtonClassName="hover:bg-white"
          alertTriggerText=""
        />
        {loc?.address[0]}
      </div>
    </div>
  );
};

const Heading = ({ title, subtitle }: { title: string; subtitle?: string }) => {
  return (
    <div className={`text-start md:text-center  max-w-sm w-full pb-2`}>
      <p className={`font-semibold text-2xl`}>{title}</p>
      <p className={`font-medium text-lg text-gray-600`}>{subtitle}</p>
    </div>
  );
};

const Footer = ({
  step,
  setStep,
  canProceed,
  onSubmit,
  isLastStep,
  formData,
}: {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  canProceed: boolean;
  onSubmit: () => void;
  isLastStep: boolean;
  formData: ListingFormData;
}) => {
  function nextButtonDisabled() {
    return false;
  }
  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t z-10 flex items-center justify-between px-6">
      <button
        onClick={() => setStep((prev) => Math.max(1, prev - 1))}
        disabled={step === 1}
        className="px-4 py-2 font-medium bg-gray-100 rounded disabled:opacity-50"
      >
        Back
      </button>

      <div className="flex space-x-2">
        {!isLastStep ? (
          <button
            onClick={() => setStep((prev) => prev + 1)}
            disabled={!nextButtonDisabled}
            className="px-4 font-medium  py-2 bg-black text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        ) : (
          <button
            onClick={onSubmit}
            disabled={!canProceed}
            className="px-4 py-2 bg-green-50 text-white rounded disabled:opacity-50"
          >
            Create Listing
          </button>
        )}
      </div>
    </div>
  );
};
