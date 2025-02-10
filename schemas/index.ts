import * as z from "zod";
import { UserRole } from "@prisma/client";
import "react-phone-number-input/style.css";

import "react-phone-number-input/style.css";
export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([
      UserRole.ADMIN,
      UserRole.CONSUMER,
      UserRole.COOP,
      UserRole.PRODUCER,
    ]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
    street: z.optional(z.string()),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: "New password is required!",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message: "Password is required!",
      path: ["password"],
    }
  );
const locationDef = {
  0: z
    .object({
      type: z.literal("Point"),
      coordinates: z.array(z.number()),
      address: z.array(z.string()),
      hours: z.any(),
    })
    .nullable(),
  1: z
    .object({
      type: z.literal("Point"),
      coordinates: z.array(z.string()),
      address: z.array(z.string()),
      hours: z.any(),
    })
    .nullable(),
  2: z
    .object({
      type: z.literal("Point"),
      coordinates: z.array(z.string()),
      address: z.array(z.string()),
      hours: z.any(),
    })
    .nullable(),
};
export const NewPasswordSchema = z.object({
  password: z.string().min(4, {
    message: "Minimum of 4 characters required",
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const ResetPasswordSchema = z.object({
  newPassword: z.string().min(4, {
    message: "Minimum 4 characters required",
  }),
  confirmNewPassword: z
    .string()
    .min(4, { message: "Minimum 4 characters required" }),
});

export const LoginSchema = z.object({
  email: z.string().min(1, {
    message: "Email or username is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});
export const RegisterVendorSchema = z
  .object({
    firstName: z.string().min(1, {
      message: "First name is required",
    }),
    email: z.string().email({
      message: "Email is required",
    }),
    password: z.string().min(4, {
      message: "Minimum 4 characters required",
    }),
    confirmPassword: z
      .string()
      .min(4, { message: "Minimum 4 characters required" }),
    name: z
      .string()
      .min(4, { message: "Name must be at least 4 characters long" })
      .max(20, { message: "Name cannot be more than 20 characters" })
      .regex(/^[a-zA-Z0-9&' |-]+$/, {
        message:
          "Name can only contain letters, numbers, &, ', -,  and single spaces",
      })
      .regex(/^(?!.*  ).*$/, {
        message: "Name cannot contain more than one consecutive space",
      })
      .refine(
        (value) => {
          const totalChars = value.length;
          const letterCount = value.replace(/[^a-zA-Z]/g, "").length;
          const letterPercentage = (letterCount / totalChars) * 100;
          return letterPercentage >= 80;
        },
        { message: "Name must contain at least 80% letters" }
      ),
    phoneNumber: z.string().min(10).max(16),
    role: z.nativeEnum(UserRole),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const RegisterSchema = z
  .object({
    email: z.string().email({
      message: "Email is required",
    }),
    password: z.string().min(4, {
      message: "Minimum 4 characters required",
    }),
    confirmPassword: z
      .string()
      .min(4, { message: "Minimum 4 characters required" }),
    name: z.string().min(1, {
      message: "Name is required",
    }),
    role: z.nativeEnum(UserRole),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const RegisterRoleSchema = z
  .object({
    firstName: z.string().min(1, {
      message: "First name is required",
    }),
    email: z.string().email({
      message: "Email is required",
    }),
    password: z.string().min(4, {
      message: "Minimum 4 characters required",
    }),
    confirmPassword: z
      .string()
      .min(4, { message: "Minimum 4 characters required" }),
    name: z.string().min(1, {
      message: "Name is required",
    }),
    phoneNumber: z.string().min(6, { message: "Phone number is required" }),
    location: z.object(locationDef),
    role: z.nativeEnum(UserRole),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const UpdateSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "First name is required" })
    .optional(),
  name: z.string().min(1, { message: "Name is required" }).optional(),
  email: z.string().email({ message: "Email is required" }).optional(),
  phoneNumber: z.any().optional(),
  location: z.object(locationDef).optional(),

  role: z.nativeEnum(UserRole).optional(),
});
