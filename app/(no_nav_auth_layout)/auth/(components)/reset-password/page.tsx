// "use client";

// import { Input } from "@/components/ui/input";
// import { useSearchParams } from "next/navigation";
// import { useState, useTransition } from "react";
// import { CardWrapper } from "../login/auth-card-wrapper";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { RegisterVendorSchema, ResetPasswordSchema } from "@/schemas";
// import PasswordInput from "../register/password-input";
// import { OutfitFont } from "@/components/fonts";
// import { Button } from "@/components/ui/button";
// import { FormSuccess } from "@/components/form-success";
// import { FormError } from "@/components/form-error";
// import axios from "axios";
// import Toast from "@/components/ui/toast";
// import { GetApiUrl } from "@/utils/get-url";

// const ResetPasswordPage = () => {
//   const params = useSearchParams();
//   const token = params?.get("token");
//   const [error, setError] = useState<string | undefined>("");
//   const [success, setSuccess] = useState<string | undefined>("");
//   const [isPending, startTransition] = useTransition();
//   const [showPassword, setShowPassword] = useState(false);

//   const toggleShowPassword = () => {
//     setShowPassword(!showPassword);
//   };
//   const form = useForm<z.infer<typeof ResetPasswordSchema>>({
//     resolver: zodResolver(ResetPasswordSchema),
//     defaultValues: {
//       newPassword: "",
//       confirmNewPassword: "",
//     },
//   });

//   const onSubmit = async (values: z.infer<typeof ResetPasswordSchema>) => {
//     const apiUrl = GetApiUrl();
//     console.log("Clicked");
//     console.log(token, values.newPassword);
//     try {
//       const res = await axios.get(
//         `${apiUrl}/reset-password?token=${token}&password=${values.newPassword}`
//       );
//       Toast({ message: res.data.message });
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <div className={`flex items-top justify-center ${OutfitFont.className}`}>
//       <CardWrapper backButtonHref="/auth/login" backButtonLabel="Back to Login">
//         <Form {...form}>
//           <form
//             onSubmit={form.handleSubmit((values) => {
//               console.log("Form submitted", values);
//               onSubmit(values);
//             })}
//             className="space-y-2 flex flex-col items-center"
//           >
//             <div className="w-[280px] sm:w-[350px]">
//               <PasswordInput
//                 form={form}
//                 isReset={true}
//                 isPending={isPending}
//                 toggleShowPassword={toggleShowPassword}
//                 showPassword={showPassword}
//               />
//             </div>
//             <FormField
//               control={form.control}
//               name="confirmNewPassword"
//               render={({ field }) => (
//                 <FormItem className="w-[280px] sm:w-[350px]">
//                   <FormLabel>Confirm New Password</FormLabel>
//                   <FormControl>
//                     <Input
//                       {...field}
//                       disabled={isPending}
//                       placeholder="******"
//                       type={showPassword ? "text" : "password"}
//                       className="w-full"
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormError message={error} />
//             <FormSuccess message={success} />
//             <Button
//               disabled={isPending}
//               type="submit"
//               className="w-[280px] sm:w-[350px]"
//             >
//               Reset Password
//             </Button>
//             <button
//               className={``}
//               onClick={() => {
//                 console.log("Clicked");
//               }}
//             >
//               Click me
//             </button>
//           </form>
//         </Form>
//       </CardWrapper>
//     </div>
//   );
// };

// export default ResetPasswordPage;
"use client";
//reset account form
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useEffect, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordSchema, ResetSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import axios from "axios";
import { toast } from "sonner";
import { OutfitFont } from "@/components/fonts";
import { GetApiUrl } from "@/utils/get-url";
import Toast from "@/components/ui/toast";
import { CardWrapper } from "../login/auth-card-wrapper";
import { useSearchParams } from "next/navigation";
import PasswordInput from "../register/password-input";
import { Label } from "@/components/ui/label";

export const ResetForm = () => {
  const searchParams = useSearchParams();
  const t = searchParams?.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (newPassword: string) => {
    const apiUrl = GetApiUrl();
    try {
      const res = await axios.get(
        `${apiUrl}/reset-password?password=${newPassword}&token=${t}`
      );
      Toast({ message: res.data.message });
    } catch (error) {
      console.error(error);
      Toast({ message: "An error occured, please try again later" });
    }
  };

  return (
    <CardWrapper backButtonLabel="Back to Login" backButtonHref="/auth/login">
      <div className={` ${OutfitFont.className}`}>
        <Label>New Password</Label>
        <input
          className="flex h-9 w-full rounded-md bg-transparent px-3 py-1 text-[1rem]  transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-neutral-600 border-[1px] "
          value={newPassword}
          placeholder="******"
          type={showPassword ? "text" : "password"}
          onChange={(e) => {
            setNewPassword(e.target.value);
          }}
        />
        <div className={`mt-4`}></div>
        <Label className={``}>Confirm New Password</Label>
        <input
          className="flex h-9 w-full rounded-md bg-transparent px-3 py-1 text-[1rem]  transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-neutral-600 border-[1px] "
          value={confirmNewPassword}
          placeholder="******"
          type={showPassword ? "text" : "password"}
          onChange={(e) => {
            setConfirmNewPassword(e.target.value);
          }}
        />
        <Button
          className={`${OutfitFont.className} mt-2 w-[280px] sm:w-[350px]`}
          onClick={() => onSubmit(newPassword)}
        >
          Send Reset Email
        </Button>
      </div>
    </CardWrapper>
  );
};
export default ResetForm;
