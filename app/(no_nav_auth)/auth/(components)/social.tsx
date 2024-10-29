"use client";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { z } from "@/app/selling/(container-selling)/availability-calendar/(components)/helper-components-calendar";

export const Social = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl");

  const onClick = (provider: "google" | "github") => {
    signIn(provider, {
      callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  };

  return (
    <Button
      size="lg"
      className={`${z.className} w-[280px] sm:w-[350px]`}
      variant="outline"
      onClick={() => onClick("google")}
    >
      Continue with <FcGoogle className="h-5 w-5 ml-1" />
    </Button>
  );
};
