import { z } from "zod";

export const categoryPostValidation = z.object({
  restaurant: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid restaurant ObjectId" }),  categoryName: z.string().min(1, { message: "Category name is required" }),
  description: z.string().optional().default(""),

  isDeleted: z.boolean().optional().default(false),
});
