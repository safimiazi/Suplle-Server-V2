import { z } from 'zod';

export const ownerPostValidation = z.object({
  // Example field (you can adjust based on your model)
  name: z.string().min(1, { message: "Name is required" }),
  // Add other fields based on your model's needs
});
export const ownerUpdateValidation = z.object({

  user: z.string().optional(),
  restaurant: z.string().optional(),

  businessName: z.string().optional(),
  businessEmail: z.string().email().optional(),

  referralCode: z.string().optional(),

  status: z.enum(["pending", "active", "rejected", "unverified"]).optional(),

  taxInfo: z
    .object({
      gstRate: z.string().optional(),
      cgstRate: z.string().optional(),
      sgstRate: z.string().optional(),
    })
    .optional(),

  isDeleted: z.boolean().optional(),
});

