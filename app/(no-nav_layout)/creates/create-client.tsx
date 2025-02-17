"use client";
import { OutfitFont } from "@/components/fonts";
import { Location } from "@prisma/client";
import { UserInfo } from "next-auth";
import { Dispatch, SetStateAction, useState } from "react";

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
            formData={formData}
            updateFormData={updateFormData}
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
          <DetailsStep formData={formData} updateFormData={updateFormData} />
        );
      case 4:
        return (
          <QualitiesStep formData={formData} updateFormData={updateFormData} />
        );
      case 5:
        return (
          <ShelfLifeStep formData={formData} updateFormData={updateFormData} />
        );
      case 6:
        return (
          <RatingStep formData={formData} updateFormData={updateFormData} />
        );
      case 7:
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
        <div className="h-full flex flex-col justify-end">
          <div className="w-full overflow-y-auto bg-white min-h-full fade-in">
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
  formData,
  locs,
  updateFormData,
  setSelectedLoc,
  selectedLoc,
}: {
  locs: Location[];
  formData: ListingFormData;
  updateFormData: (field: keyof ListingFormData, value: any) => void;
  setSelectedLoc: Dispatch<SetStateAction<Location | undefined>>;
  selectedLoc?: Location;
}) => {
  return (
    <>
      {locs.map((loc: any, index: number) => (
        <button className={``} key={index}></button>
      ))}
    </>
  );
};

const CategoryStep = ({
  formData,
  updateFormData,
}: {
  formData: ListingFormData;
  updateFormData: (field: keyof ListingFormData, value: any) => void;
}) => {
  return <></>;
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
  return (
    <div className="fixed top-0 left-0 right-0 h-20 bg-white border-b z-10 text-black text-center">
      {loc?.address[0]}
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
  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t z-10 flex items-center justify-between px-6">
      <button
        onClick={() => setStep((prev) => Math.max(1, prev - 1))}
        disabled={step === 1}
        className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50"
      >
        Back
      </button>

      <div className="flex space-x-2">
        {!isLastStep ? (
          <button
            onClick={() => setStep((prev) => prev + 1)}
            disabled={!canProceed}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        ) : (
          <button
            onClick={onSubmit}
            disabled={!canProceed}
            className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
          >
            Create Listing
          </button>
        )}
      </div>
    </div>
  );
};
