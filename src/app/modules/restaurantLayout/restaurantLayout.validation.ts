import { z } from "zod";
import mongoose from "mongoose";

export const restaurantLayoutPostValidation = z.object({
  floor: z
    .string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid floor ID",
    }),
  restaurant: z
    .string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid restaurant ID",
    }),
  numberOfTables: z
    .number({ required_error: "Number of tables is required" })
    .int("Number of tables must be an integer")
    .min(1, "Number of tables must be at least 1"),
  isDeleted: z.boolean().optional(),
});

export const restaurantLayoutUpdateValidation = restaurantLayoutPostValidation.partial();
