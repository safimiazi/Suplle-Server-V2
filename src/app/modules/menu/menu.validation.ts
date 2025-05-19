import { z } from "zod";

const sizeEnum = z.enum(["small", "medium", "large"]);

export const menuPostValidation = z.object({
  category: z
    .string({ required_error: "Category ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid Category ID" }),

  restaurant: z
    .string({ required_error: "Restaurant ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid Restaurant ID" }),

  itemName: z.string().min(1, { message: "Item name is required" }),

  image: z
    .string()
    .optional()
    .default(""),

  price: z.number({ required_error: "Price is required" }),

  size: sizeEnum,

  availability: z.boolean().optional().default(true),

  description: z.string().optional().default(""),

  rating: z.number().optional().default(0),

  like: z.number().optional().default(0),

  isDeleted: z.boolean().optional().default(false),
});

// PATCH validation (partial update)
export const menuUpdateValidation = menuPostValidation.partial();
