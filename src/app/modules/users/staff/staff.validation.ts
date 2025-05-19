import { z } from "zod";
import mongoose from "mongoose";

const objectIdValidator = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  });

const statusEnum = z.enum(["active", "inactive"]);

export const staffPostValidation = z.object({
  user:objectIdValidator,
  restaurant: objectIdValidator,
  workDay: z.string().min(1, { message: "Work day is required" }),
  workTime: z.string().min(1, { message: "Work time is required" }),
  status: statusEnum.optional(),
});

export const staffUpdateValidation = staffPostValidation.partial().optional();
