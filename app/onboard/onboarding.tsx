"use client";
import { useState } from "react";
import ProfileStep from "./profile-step";
import StoreStep from "./store-step";
import StripeStep from "./stripe-step";
import { IoReturnDownBack, IoReturnDownForward } from "react-icons/io5";
import axios from "axios";
import { toast } from "sonner";
import { UserInfo } from "@/next-auth";
import { CiCircleInfo } from "react-icons/ci";
import { ExtendedHours } from "@/next-auth";
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
import { useRouter } from "next/navigation";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});
interface Props {
  user: UserInfo;
  index: number;
}
const Onboarding = ({ user, index }: Props) => {
  const router = useRouter();
  const [step, setStep] = useState(index);
  const [formData, setFormData] = useState<{
    hours?: ExtendedHours;
    image?: string;
    bio?: string;
  }>({});

  const [isLoading, setIsLoading] = useState(false);
  let defaultHours;
  if (user?.hours) {
    defaultHours = user?.hours;
  } else {
    defaultHours = {
      0: [{ open: 480, close: 1020 }],
      1: [{ open: 480, close: 1020 }],
      2: [{ open: 480, close: 1020 }],
      3: [{ open: 480, close: 1020 }],
      4: [{ open: 480, close: 1020 }],
      5: [{ open: 480, close: 1020 }],
      6: [{ open: 480, close: 1020 }],
    };
  }

  const [coOpHours, setCoOpHours] = useState<ExtendedHours>(defaultHours);
  const handleNext = async () => {
    if (step === 3) {
      handleSubmit();
      router.push("/dashboard/my-store");
    } else {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("/api/stripe/accept-tos", {
        stripeAccountId: user?.stripeAccountId,
      });
      if (response.status === 200) {
        if (formData.image || coOpHours || formData.bio) {
          try {
            const updateResponse = await axios.post("/api/update", {
              image: formData.image,
              hours: coOpHours,
              bio: formData.bio,
            });
            if (updateResponse.status === 200) {
            } else {
            }
          } catch (error) {
            console.error("Error:", error);
          }
        }
        setStep(step + 1);
      } else {
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while accepting Terms of Service");
    }
    setIsLoading(false);
  };

  return (
    <div className="h-screen">
      <div className="flex flex-col md:flex-row text-black">
        <div className="onboard-left md:w-2/5">
          <div className="flex flex-col items-start pl-12 py-5 lg:py-20 ">
            <h2 className="tracking font-medium 2xl:text-2xl text-lg tracking-tight md:pt-[20%]">
              Finish your account setup
            </h2>
            {step === 2 && (
              <div className="flex flex-row">
                <div className="2xl:text-4xl text-lg font-bold tracking-tight">
                  Now, tell us about yourself
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button className="shadow-none bg-transparent hover:bg-transparent text-black">
                      <CiCircleInfo className="lg:text-4xl" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="popover border-none xl:absolute xl:bottom-10">
                    A profile picture and description is not required, but it is
                    recommended to encourage consumer confidence.
                  </PopoverContent>
                </Popover>
              </div>
            )}
            {step === 1 && (
              <div className="flex flex-row items-center">
                {" "}
                <div className="2xl:text-5xl text-lg font-bold tracking-tight flex">
                  First, let&apos;s set up your store
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button className="shadow-none bg-transparent hover:bg-transparent text-black">
                      <CiCircleInfo className="lg:text-4xl" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="popover xl:absolute xl:bottom-10 text-black left-5">
                    Use the sliders to set your open and close times for each
                    day of the week, this will determine when consumers are
                    allowed to pick up from your co-op location.
                  </PopoverContent>
                </Popover>
              </div>
            )}
            {step === 3 && (
              <div className="flex flex-col items-start">
                <div className="flex flex-row">
                  <div className="2xl:text-3xl text-lg font-bold tracking-tight">
                    Finally, connect with Stripe for easy & secure payouts
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
                            EZHomesteading partners with Stripe to keep your
                            information as secure as possible. All of the
                            information in this form is required by Stripe & the
                            government for regulatory purposes. EZHomesteading
                            does not have access to sensitive information such
                            as your full SSN or bank accounting number.
                          </p>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button className="shadow-none bg-transparent hover:bg-transparent text-black m-0 p-0 text-xs">
                      Why are we asking for this information?
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="popover xl:absolute xl:bottom-10">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground ">
                          “Know Your Customer” (KYC) obligations for payments
                          require Stripe to collect and maintain information on
                          all Stripe account holders. These requirements come
                          from our regulators and are intended to prevent abuse
                          of the financial system, provide your potential
                          customers with clear and useful information, and
                          prevent material loss to your business or to Stripe.
                          You can read more on that
                          {""}
                          <a
                            href="https://support.stripe.com/questions/passport-id-or-drivers-license-upload-requirement"
                            className="underline ml-1 text-blue-400"
                          >
                            here
                          </a>
                          .{" "}
                          <strong>
                            We do not use this information for any other
                            purposes, and we take your privacy and the security
                            of your data very seriously.
                          </strong>
                        </p>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            )}
            <Breadcrumb
              className={`${outfit.className} text-black pt-5 z-10 text-xs`}
            >
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="text-xs">
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem
                  className={
                    step === 1
                      ? "font-bold cursor-none text-xs"
                      : "font-normal cursor-pointer text-xs "
                  }
                  onMouseDown={() => setStep(1)}
                >
                  Co-op
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem
                  className={
                    step === 2
                      ? "font-bold cursor-none text-xs"
                      : "font-normal cursor-pointer"
                  }
                  onMouseDown={() => setStep(2)}
                >
                  Profile
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem
                  className={
                    step === 3
                      ? "font-bold cursor-none "
                      : "font-normal cursor-pointer text-xs"
                  }
                  onMouseDown={() => setStep(3)}
                >
                  Stripe
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        <div className="md:w-3/5 onboard-right relative">
          {step === 1 && (
            <div className="sm:min-h-screen  hideOverflow lg:py-20">
              <StoreStep
                coOpHours={coOpHours}
                setCoOpHours={setCoOpHours}
                user={user}
              />
            </div>
          )}
          {step === 2 && (
            <div className="sm:min-h-screen h-[calc(100vh-264px)] hideOverflow py-20">
              <ProfileStep
                formData={formData}
                setFormData={setFormData}
                user={user}
              />
            </div>
          )}
          {step === 3 && (
            <div className="mb-4 min-h-screen p-6">
              <StripeStep user={user} />
            </div>
          )}
          {step > 1 && (
            <IoReturnDownBack
              onClick={handlePrevious}
              className="absolute bottom-0 left-5 text-6xl hover:cursor-pointer"
            />
          )}

          {step < 4 && (
            <IoReturnDownForward
              onClick={handleNext}
              className="absolute bottom-0 right-5 text-6xl hover:cursor-pointer"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
