import { z } from "zod";

// Define the days of the week for Work Days
const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

// Define roles for staff
const staffRoles = [
  "staff",
  "manager",
  "waiter",
  "chief",
  "cashier",
  "maintenance",
] as const;

const staffPostValidation = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  phone: z
    .string()
    .optional()
  ,
  role: z.enum(staffRoles, { message: "Invalid role selected" }),
  workDays: z
    .array(z.enum(daysOfWeek))
    .min(1, "At least one work day must be selected")
    .optional(),
  workTime: z
    .object({
      start: z.string().regex(/^\d{1,2}:\d{2} (AM|PM)$/i, "Invalid time format"),
      end: z.string().regex(/^\d{1,2}:\d{2} (AM|PM)$/i, "Invalid time format"),
    })
    .optional(),
  status: z.enum(["Active", "Inactive"], {
    message: "Status must be Active or Inactive",
  }),
  image: z
    .string()
    .optional()

});

export const staffUpdateValidation = staffPostValidation.partial().optional();
