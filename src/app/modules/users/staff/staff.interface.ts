import mongoose, { mongo } from "mongoose";

// Define the days of the week for Work Days
export const DaysOfWeekEnum = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

// Define roles for staff
export  const StaffRolesEnum = [
  "staff",
  "manager",
  "waiter",
  "chief",
  "cashier",
  "maintenance",
] as const;

export interface IStaff {
  user: mongoose.Types.ObjectId | null;
  restaurant: mongoose.Types.ObjectId | null;

  workDays?: (typeof DaysOfWeekEnum)[number][];
  workTime?: {
    start: string;
    end: string;
  };
  status: "Active" | "Inactive";
  isDeleted?: boolean;
}

export interface IStaffUpdate extends Partial<IStaff> {}