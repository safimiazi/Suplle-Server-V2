import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const orderTypeEnum = z.enum(["dine in", "takeaway"]);
const statusEnum = z.enum(["pending", "inProgress", "delivered", "cancel"]);
const paymentTypeEnum = z.enum(["cash", "card"]);

export const orderPostValidation = z.object({
  restaurant: z
    .string({ required_error: "Restaurant ID is required" })
    .regex(objectIdRegex, { message: "Invalid Restaurant ID" }),

  zone: z
    .string()
    .regex(objectIdRegex, { message: "Invalid Zone ID" })
    .optional(),

  menus: z
    .array(
      z.object({
        menu: z
          .string({ required_error: "Menu ID is required" })
          .regex(objectIdRegex, { message: "Invalid Menu ID" }),
        quantity: z
          .number({ required_error: "Quantity is required" })
          .min(1, { message: "Quantity must be at least 1" }),
      })
    )
    .nonempty({ message: "At least one menu item is required" }),

  customerName: z.string().min(1, { message: "Customer name is required" }),

  customerPhone: z.string().min(7, { message: "Customer phone must be at least 7 digits" }),

  orderType: orderTypeEnum,

  specialRequest: z.string().optional().default(""),

  total: z.number().min(0).optional().default(0),

  paymentMethod: z.object({
    type: paymentTypeEnum,
    cardNumber: z.string().nullable().optional(),
  }),

  status: statusEnum.optional().default("pending"),

  isDeleted: z.boolean().optional().default(false),
});


export const orderUpdateValidation = z.object({
  restaurant: z
    .string()
    .regex(objectIdRegex, { message: "Invalid Restaurant ID" })
    .optional(),

  zone: z
    .string()
    .regex(objectIdRegex, { message: "Invalid Zone ID" })
    .optional(),

  menus: z
    .array(
      z.object({
        menu: z
          .string()
          .regex(objectIdRegex, { message: "Invalid Menu ID" }),
        quantity: z
          .number()
          .min(1, { message: "Quantity must be at least 1" }),
      })
    )
    .nonempty({ message: "At least one menu item is required" })
    .optional(),

  customerName: z.string().min(1, { message: "Customer name is required" }).optional(),

  customerPhone: z.string().min(7, { message: "Customer phone must be at least 7 digits" }).optional(),

  orderType: orderTypeEnum.optional(),

  specialRequest: z.string().optional(),

  total: z.number().min(0).optional(),

  paymentMethod: z
    .object({
      type: paymentTypeEnum,
      cardNumber: z.string().nullable().optional(),
    })
    .optional(),

  status: statusEnum.optional(),

  isDeleted: z.boolean().optional(),
});
