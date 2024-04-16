import * as z from "zod";
import { UserRole } from "@prisma/client";

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

export const LoginSchema = z.object({
  email: z.string().min(1, {
    message: "Email or username is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});

export const RegisterVendorSchema = z.object({
  firstName: z.string().min(1, {
    message: "First name is required",
  }),
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(4, {
    message: "Minimum 4 characters required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
  phoneNumber: z.string().min(6, { message: "Phone number is required" }),
  location: z.object({
    type: z.literal("Point"),
    coordinates: z.tuple([z.number(), z.number()]),
    address: z.tuple([z.string(), z.string(), z.string(), z.string()]),
  }),
  role: z.nativeEnum(UserRole),
});

export const RegisterSchema = z.object({
  firstName: z.string().min(1, {
    message: "First name is required",
  }),
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(4, {
    message: "Minimum 4 characters required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
  role: z.nativeEnum(UserRole),
});

export const RegisterRoleSchema = z.object({
  firstName: z.string().min(1, {
    message: "First name is required",
  }),
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(4, {
    message: "Minimum 4 characters required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
  phoneNumber: z.string().min(6, { message: "Phone number is required" }),
  location: z.object({
    type: z.literal("Point"),
    coordinates: z.tuple([z.number(), z.number()]),
    address: z.tuple([z.string(), z.string(), z.string(), z.string()]),
  }),
  role: z.nativeEnum(UserRole),
});

export const UpdateSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "First name is required" })
    .optional(),
  name: z.string().min(1, { message: "Name is required" }).optional(),
  email: z.string().email({ message: "Email is required" }).optional(),
  phoneNumber: z
    .string()
    .min(6, { message: "Phone number is required" })
    .optional(),

  location: z
    .object({
      type: z.literal("Point"),
      coordinates: z.tuple([z.number(), z.number()]),
      address: z.tuple([z.string(), z.string(), z.string(), z.string()]),
    })
    .optional(),

  role: z.nativeEnum(UserRole).optional(),
});
