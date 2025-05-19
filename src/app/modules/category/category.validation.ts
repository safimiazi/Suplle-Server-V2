import { z } from 'zod';
import { CategoryModel } from './category.model';


export const categoryPostValidation = z.object({
  restaurant: z
    .string()
    .min(1, { message: "Restaurant ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid MongoDB ObjectId" }),

  categoryName: z
    .string()
    .min(1, { message: "Category name is required" })
  ,

  description: z.string().optional().default(""),

  image: z
    .string()
    .optional()
    .default(""),

  isDeleted: z.boolean().optional().default(false),
});
