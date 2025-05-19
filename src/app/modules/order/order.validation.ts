import { z } from "zod";

const orderTypeEnum = z.enum(["dine in", "takeaway"]);
const statusEnum = z.enum(["pending", "inProgress", "delivered", "cancel"]);

export const orderPostValidation = z.object({
  restaurant: z
    .string({ required_error: "Restaurant ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid Restaurant ID" }),

  zone: z
    .string({ required_error: "Table ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid Table ID" }),

  menus: z
    .array(
      z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, { message: "Each menu ID must be valid" })
    )
    .nonempty({ message: "At least one menu item is required" }),

  customerName: z
    .string({ required_error: "Customer name is required" })
    .min(1, { message: "Customer name cannot be empty" }),

  customerPhone: z
    .string({ required_error: "Customer phone is required" })
    .min(7, { message: "Customer phone must be at least 7 digits" }),

  orderType: orderTypeEnum,

  status: statusEnum.optional().default("pending"),

  specialRequest: z.string().optional().default(""),

  total: z.number({ required_error: "Total is required" }),

  isDeleted: z.boolean().optional().default(false),
});

export const orderUpdateValidation = orderPostValidation.partial();
