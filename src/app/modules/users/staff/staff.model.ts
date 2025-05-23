import mongoose, { Schema, model, Document, Types } from "mongoose";
import { DaysOfWeekEnum, IStaff } from "./staff.interface";


const StaffSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    restaurant: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true },
    workDays: {
      type: [
        {
          type: String,
          enum: DaysOfWeekEnum,
        },
      ],
      required: false,
      default: [],
    }, 
    workTime: {
      type: {
        start: {
          type: String,
          match: [/^\d{1,2}:\d{2} (AM|PM)$/i, "Invalid start time format"],
        },
        end: {
          type: String,
          match: [/^\d{1,2}:\d{2} (AM|PM)$/i, "Invalid end time format"],
        },
      },
      required: false,
    },
    status: {
      type: String,
      default: "active"
    },
    isDeleted: {
      type: Boolean,
      default: false
    }

  },
  {
    timestamps: true,
  }
);

export const StaffModel = model<IStaff>("Staff", StaffSchema);
