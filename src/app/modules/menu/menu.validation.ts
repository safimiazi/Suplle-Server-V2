import { z } from "zod";

// Match the size type used in your Mongoose schema
const sizeEnum = z.enum(["small", "medium", "large"]);

export const menuPostValidation = z.object({
  category: z
    .string({ required_error: "Category ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid Category ID" }),


  itemName: z
    .string({ required_error: "Item name is required" })
    .min(1, "Item name cannot be empty"),

  image: z
    .string()
    .url("Image must be a valid URL")
    .optional()
    .default(""),

  price: z
    .number({ required_error: "Price is required" })
    .positive("Price must be greater than 0"),

  size: sizeEnum,

  availability: z
    .string({ required_error: "Availability is required" })
    .min(1, "Availability cannot be empty"), // matches Mongoose: type: String, required: true

  description: z
    .string({ required_error: "Description is required" })
    .min(1, "Description cannot be empty"),

  rating: z
    .number()
    .min(0)
    .max(5)
    .optional()
    .default(0),

  like: z
    .number()
    .min(0)
    .optional()
    .default(0),

  isDeleted: z
    .boolean()
    .optional()
    .default(false),
});
export const menuUpdateValidation = menuPostValidation.partial();
