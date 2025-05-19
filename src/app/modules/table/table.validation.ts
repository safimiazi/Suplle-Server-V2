import { z } from "zod";

// MongoDB ObjectId regex
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const tablePostValidation = z.object({
  restaurant: z
    .string({ required_error: "Restaurant ID is required" })
    .regex(objectIdRegex, { message: "Invalid Restaurant ID format" }),

  tableName: z
    .string({ required_error: "Table name is required" })
    .min(1, { message: "Table name cannot be empty" }),

  tableSetting: z
    .string({ required_error: "Table setting is required" })
    .min(1, { message: "Table setting cannot be empty" }),

  seatingCapacity: z
    .number({ required_error: "Seating capacity is required" })
    .int({ message: "Seating capacity must be an integer" })
    .positive({ message: "Seating capacity must be greater than 0" }),

  isDeleted: z.boolean().optional().default(false),
});

export const tableUpdateValidation = tablePostValidation.partial();
