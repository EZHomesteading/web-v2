"use client"; //onboarding page import { useEffect, useState } from "react"; import axios from "axios"; import { toast } from "sonner"; import { UserInfo } from "@/next-auth"; import { ExtendedHours } from "@/next-auth"; import { Button } from "@/app/components/ui/button"; import { Progress } from "@/app/components/ui/progress"; import { useRouter } from "next/navigation"; import { Outfit } from "next/font/google"; import StepOne from "./step1"; import StepTwo from "./step2"; import StepThree from "./step3"; import StepFour from "./step4"; import StepSix from "./step6"; import StepFive from "./step5"; import StepSeven from "./step7"; import StepEight from "./step8"; import StepNine from "./step9"; import Link from "next/link";  const outfit = Outfit({   subsets: ["latin"],   display: "swap", }); interface Props {   user: UserInfo;   index: number;   apiKey?: string; } const Onboarding = ({ user, index, apiKey }: Props) => {   const router = useRouter();   const [step, setStep] = useState(index);   const [formData, setFormData] = useState<{     hours?: ExtendedHours;     image?: string;     bio?: string;   }>({});    const [isLoading, setIsLoading] = useState(false);    const handleNext = async () => {     setStep(step + 1);     setProgress(step * 10);   };    const handlePrevious = () => {     setStep(step - 1);     setProgress(step * 10);   };    useEffect(() => {     if (step === 1) {       setProgress(0);     } else {       let newStep = step - 1;       setProgress(newStep * 11);     }   }, [step]);   const [progress, setProgress] = useState(0);   return (     <div className="flex flex-col h-screen">       <Link         href="/"         className={${outfit.className} absolute top-5 left-5 bg-slate-300 px-2 rounded-sm shadow-sm font-light hover:cursor-pointer}       >         Home       </Link>        <div className="flex-grow overflow-y-auto !overflow-x-hidden">         {step === 1 && <StepOne />}         {step === 2 && <StepTwo />}         {step === 3 && <StepThree user={user} apiKey={apiKey} />}         {step === 4 && <StepFour user={user} />}         {step === 5 && <StepFive />}         {step === 6 && <StepSix userImage={user?.image} />}         {step === 7 && <StepSeven userBio={user?.bio} />}         {step === 8 && <StepEight />}         {step === 9 && <StepNine user={user} />}       </div>       <div className="">         <Progress value={progress} className="w-full mb-4" />          {step === 1 ? (           <div className="flex justify-end px-4 pb-4">             <Button onClick={handleNext}>Next</Button>           </div>         ) : (           <div className="flex justify-between px-4 pb-4">             {step > 1 && (               <Button onClick={handlePrevious} variant="outline">                 Back               </Button>             )}             {step < 9 && <Button onClick={handleNext}>Next</Button>}             {step === 9 && <Button onClick={handleNext}>Finish</Button>}           </div>         )}       </div>     </div>   ); };  export default Onboarding;Each of the components where user is passed in contains form data, how do I pass the form data up to update the user on click of update
//coop hours parent element
import icon from "@/public/images/website-images/camera-icon.png";
import { UploadButton } from "@/utils/uploadthing";
import Image from "next/image";
import { Outfit } from "next/font/google";
import { useState } from "react";
import Avatar from "../components/Avatar";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});
interface p {
  userImage?: string;
  updateFormData: (newData: Partial<{ image?: string }>) => void;
}
const StepSix = ({ userImage, updateFormData }: p) => {
  const [image, setImage] = useState(userImage || "");
  const handleImageUpload = (url: string) => {
    setImage(url);
    updateFormData({ image: url });
  };
  return (
    <>
    <div className="flex flex-col justify-center items-center h-full">
  
      <div className="border-[2px] border-dashed bg-slate-100 h-[200px] sm:h-[300px]  aspect-square rounded-xl relative shadow-xl">
        {image ? (
          <>
            <div className="absolute bottom-1/2 left-1/2 transform -translate-x-1/2">
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res: { url: string }[]) => {
                  handleImageUpload(res[0].url);
                }}
                onUploadError={(error: Error) => {
                  alert(`ERROR! ${error.message}`);
                }}
                className={`${outfit.className} w-[150px] ut-allowed-content:hidden ut-button:bg-white ut-button:text-black ut-button:w-fit ut-button:px-2 ut-button:h-full ut-button:border ut-button:border-black rounded-sm`}
                content={{
                  button({ ready }) {
                    if (ready) return <div>Change Image</div>;
                    return "Loading...";
                  },
                }}
              />
            </div>
            <div className="absolute top-[15%] left-1/2 transform -translate-x-1/2 ">
              <Avatar image={image} />
            </div>{" "}
          </>
        ) : (
          <>
            <div className="absolute bottom-1/2 w-[150px] left-1/2 transform -translate-x-1/2">
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res: { url: string }[]) => {
                  setImage(res[0].url);
                }}
                onUploadError={(error: Error) => {
                  alert(`ERROR! ${error.message}`);
                }}
                className={`${outfit.className} w-[150px] ut-allowed-content:hidden ut-button:bg-white ut-button:text-black ut-button:w-fit ut-button:px-2 ut-button:h-full ut-button:border ut-button:border-black rounded-sm`}
                content={{
                  button({ ready }) {
                    if (ready) return <div className="">Add Profile Image</div>;
                    return "Loading...";
                  },
                }}
              />{" "}
            </div>
            <div className="absolute top-[15%] left-1/2 transform -translate-x-1/2">
              <Image src={icon} alt="Add a Photo" width={50} height={50} />
            </div>
          </>
        )}
      </div>
    </div>
   </> 
  );
};

export default StepSix;