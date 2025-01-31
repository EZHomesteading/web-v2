"use client";
//create password component
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PiEye, PiEyeClosedThin } from "react-icons/pi";
interface p {
  form: any;
  isPending: boolean;
  toggleShowPassword: () => void;
  showPassword: boolean;
  isReset?: boolean;
}
const PasswordInput = ({
  form,
  isPending,
  isReset = false,
  showPassword,
  toggleShowPassword,
}: p) => {
  return (
    <FormField
      control={form.control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{isReset && "New"} Password</FormLabel>
          <div className="relative">
            <FormControl>
              <Input
                {...field}
                disabled={isPending}
                placeholder="******"
                type={showPassword ? "text" : "password"}
              />
            </FormControl>
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute top-2 right-2"
            >
              {showPassword ? (
                <PiEye size={20} />
              ) : (
                <PiEyeClosedThin size={20} />
              )}
            </button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PasswordInput;
