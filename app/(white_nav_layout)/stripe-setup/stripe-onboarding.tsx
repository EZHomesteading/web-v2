"use client";
//stripe setup component
import {
  ConnectAccountOnboarding,
  ConnectComponentsProvider,
} from "@stripe/react-connect-js";
import { loadConnectAndInitialize } from "@stripe/connect-js/pure";
import { useState, useEffect, SetStateAction, Dispatch } from "react";
import axios from "axios";
import Loader from "@/components/secondary-loader";
import { UserInfo } from "next-auth";

interface Props {
  user?: UserInfo;
  setFinish: Dispatch<SetStateAction<boolean>>;
}
const AccountOnboardingUI = ({ user, setFinish }: Props) => {
  const body = user?.stripeAccountId;

  const [stripeConnectInstance, setStripeConnectInstance] = useState<
    any | null
  >(null);

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const response = await axios.post("/api/stripe/account-session", {
          stripeAccountId: body,
        });
        const { client_secret: clientSecret } = response.data;
        return clientSecret;
      } catch (error) {
        console.error("An error occurred: ", error);
        return undefined;
      }
    };

    const initializeConnect = () => {
      const instance = loadConnectAndInitialize({
        publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
        fetchClientSecret: fetchClientSecret,
      });
      setStripeConnectInstance(instance);
    };

    initializeConnect();
  }, [body]);

  if (!stripeConnectInstance) {
    return <Loader />;
  }

  return (
    <div className="mt-0">
      <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
        <ConnectAccountOnboarding
          onExit={() => {
            setFinish(true);
            console.log("The account has exited onboarding");
          }}
          fullTermsOfServiceUrl="https://ezhomesteading.vercel.app/tos"
          privacyPolicyUrl="https://ezhomesteading.vercel.app/privacy-policy"
          skipTermsOfServiceCollection={false}
          collectionOptions={{
            fields: "currently_due",
            futureRequirements: "include",
          }}
        />
      </ConnectComponentsProvider>
    </div>
  );
};

export default AccountOnboardingUI;
