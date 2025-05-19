import { z } from "zod";

export const floorPostValidation = z.object({
  restaurant: z
    .string({ required_error: "Restaurant ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid Restaurant ID" }),

  floorName: z.string().min(1, { message: "Floor name is required" }),

  isDeleted: z.boolean().optional().default(false),
});

export const floorUpdateValidation = floorPostValidation.partial();
