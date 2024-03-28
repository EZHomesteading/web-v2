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
  password: z.string().min(6, {
    message: "Minimum of 6 characters required",
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(4, {
    message: "Minimum 4 characters required",
  }),
  name: z.string().min(4, {
    message: "Minimum 4 characters required",
  }),
  role: z.nativeEnum(UserRole),
});

export const UpdateSchema = z
  .object({
    newName: z.optional(z.string().min(1, { message: "Name is required" })),
    newEmail: z.optional(
      z.string().email({ message: "Invalid email address" })
    ),
    newPassword: z.optional(
      z.string().min(6, { message: "Minimum 6 characters required" })
    ),
    location: z.optional(z.string()),
    email: z.string().email({ message: "Email is required" }),
    password: z.string().min(6, { message: "Minimum 6 characters required" }),
    name: z.string().min(1, { message: "Name is required" }),
    newRole: z.enum([UserRole.COOP, UserRole.PRODUCER]),
  })
  .refine(
    (data) => {
      if (data.newPassword && data.newPassword.length < 6) {
        return false;
      }
      return true;
    },
    {
      message: "New password must be at least 6 characters",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.newEmail && !isValidEmail(data.newEmail)) {
        return false;
      }
      return true;
    },
    {
      message: "Invalid new email address",
      path: ["newEmail"],
    }
  )
  .refine(
    (data) => {
      if (data.newName && data.newName.trim().length === 0) {
        return false;
      }
      return true;
    },
    {
      message: "New name cannot be empty",
      path: ["newName"],
    }
  );

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
