import { z } from "zod";
import mongoose from "mongoose";

const objectIdValidator = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  });

const roleEnum = z.enum([
  "admin",
  "restaurant_owner",
  "staff",
  "customer",
  "manager",
  "dine in",
  "waiter",
  "chief",
  "cashier",
  "maintenance",
]);

export const userInputSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(7, { message: "Phone number is required" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  role: roleEnum,
  image: z.string().url({ message: "Invalid image URL" }).optional(),
  providerId: z.string().optional().nullable(),
  provider: z.string().optional().nullable(),
  otp: z.string().optional().nullable(),
  otpExpiresAt: z.string().datetime().optional().nullable(),
});

export const usersUpdateValidation = userInputSchema.partial();
