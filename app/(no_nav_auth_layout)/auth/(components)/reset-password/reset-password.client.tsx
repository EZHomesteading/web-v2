"use client";
//reset account form
import { Button } from "@/components/ui/button";
import axios from "axios";
import { OutfitFont } from "@/components/fonts";
import Toast from "@/components/ui/toast";
import { CardWrapper } from "../login/auth-card-wrapper";
import { useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { PiEye, PiEyeClosedThin } from "react-icons/pi";
import Link from "next/link";
import { useState } from "react";

export const ResetForm = ({ apiUrl }: { apiUrl: string }) => {
  const searchParams = useSearchParams();
  const t = searchParams?.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (newPassword: string) => {
    if (confirmNewPassword !== newPassword) {
      return Toast({ message: "Both passwords must match" });
    }

    if (newPassword.length < 6) {
      return Toast({ message: "New password must be atleast 6 characters" });
    }

    try {
      const res = await axios.get(
        `${apiUrl}/resend/reset-password?password=${newPassword}&token=${t}`
      );
      Toast({
        message: res.data.message,
        details: (
          <>
            {res.status === 200 && (
              <Link href="/auth/login" className={`text-sky-200 underline`}>
                Return to sign in
              </Link>
            )}
          </>
        ),
      });
    } catch (error) {
      console.error(error);
      Toast({ message: "An error occured, please try again later" });
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <CardWrapper backButtonLabel="Back to Login" backButtonHref="/auth/login">
      <div className={` ${OutfitFont.className}`}>
        <Label>New Password</Label>
        <div className={`relative`}>
          <input
            className="flex h-9 w-full rounded-md bg-transparent px-3 py-1 text-[1rem]  transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-neutral-600 border-[1px] "
            value={newPassword}
            placeholder="******"
            type={showPassword ? "text" : "password"}
            onChange={(e) => {
              setNewPassword(e.target.value);
            }}
          />
          <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute top-2 right-2"
          >
            {showPassword ? <PiEye size={20} /> : <PiEyeClosedThin size={20} />}
          </button>
        </div>
        <div className={`mt-4`}></div>
        <Label>Confirm New Password</Label>
        <div className={`relative`}>
          <input
            className="flex h-9 w-full rounded-md bg-transparent px-3 py-1 text-[1rem]  transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-neutral-600 border-[1px] "
            value={confirmNewPassword}
            placeholder="******"
            type={showPassword ? "text" : "password"}
            onChange={(e) => {
              setConfirmNewPassword(e.target.value);
            }}
          />
          <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute top-2 right-2"
          >
            {showPassword ? <PiEye size={20} /> : <PiEyeClosedThin size={20} />}
          </button>
        </div>
        <Button
          className={`${OutfitFont.className} mt-2 w-[280px] sm:w-[350px]`}
          onClick={() => onSubmit(newPassword)}
        >
          Set New Password
        </Button>
      </div>
    </CardWrapper>
  );
};
export default ResetForm;
