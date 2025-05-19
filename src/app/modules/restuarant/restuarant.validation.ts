import { z } from "zod";
import mongoose from "mongoose";

// Helper to validate MongoDB ObjectId strings
const objectId = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
  message: "Invalid ObjectId",
});

export const restuarantPostValidation = z.object({
  owner: objectId.optional(), // Optional as per your Mongoose schema
  restaurantName: z.string().min(1, "Restaurant name is required"),
  restaurantAddress: z.string().min(1, "Restaurant address is required"),
  phone: z.string().min(1, "Phone number is required"),
  status: z.enum(["active", "pending", "cancelled"]).optional(),
  logo: z.string().optional().nullable(),
  tagline: z.string().optional(),
  coverPhoto: z.string().optional(),
  images: z.array(z.string()).optional().default([]),
  description: z.string().optional(),
  menus: z.array(objectId).optional().default([]),
  isDeleted: z.boolean().optional(),
});

export const restuarantUpdateValidation = restuarantPostValidation.partial();
