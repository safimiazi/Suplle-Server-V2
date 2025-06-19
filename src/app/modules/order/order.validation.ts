import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const orderTypeEnum = z.enum(["dine in", "take away"]);
const statusEnum = z.enum(["pending", "inProgress", "delivered", "cancel"]);
const paymentTypeEnum = z.enum(["cash", "card"]);

export const orderPostValidation = z.object({

  table: z.string().optional(),

  menus: z
    .array(
      z.object({
        menu: z
          .string({ required_error: "Menu ID is required" })
          .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid Menu ID" }),
        quantity: z
          .number({ required_error: "Quantity is required" })
          .min(1, { message: "Quantity must be at least 1" }),
      })
    )
    .nonempty({ message: "At least one menu item is required" }),

  customerName: z.string().nullable().optional().default(null),

  customerPhone: z.string().nullable().optional().default(null),


  orderType: z.enum(["dine in", "take away"]),

  specialRequest: z.string().optional().default(""),

  total: z.number().min(0).optional().default(0),

  paymentMethod: z.object({
    type: z.enum(["cash", "card"]),
    cardNumber: z.string().nullable().optional(),
  }),

  status: z.enum(["pending", "inProgress", "delivered", "cancel"]).optional().default("pending"),

  isDeleted: z.boolean().optional().default(false),
});

export const orderUpdateValidation = z.object({

  table: z.string().optional(),

  menus: z
    .array(
      z.object({
        menu: z
          .string()
          .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid Menu ID" }),
        quantity: z
          .number()
          .min(1, { message: "Quantity must be at least 1" }),
      })
    )
    .nonempty({ message: "At least one menu item is required" })
    .optional(),

  customerName: z.string().min(1, { message: "Customer name cannot be empty" }).optional(),

  customerPhone: z.string().min(7, { message: "Customer phone must be at least 7 characters" }).optional(),

  orderType: z.enum(["dine in", "takeaway"]).optional(),

  specialRequest: z.string().optional(),

  total: z.number().min(0).optional(),

  paymentMethod: z
    .object({
      type: z.enum(["cash", "card"]),
      cardNumber: z.string().nullable().optional(),
    })
    .optional(),

  status: z.enum(["pending", "inProgress", "delivered", "cancel"]).optional(),

  isDeleted: z.boolean().optional(),
});

