import mongoose, { Schema, model, Document, Types } from "mongoose";
import { IStaff } from "./staff.interface";


const StaffSchema = new Schema<IStaff>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    restaurant: { type: Schema.Types.ObjectId,  ref: "Restaurant", required: true },
    workDay: { type: String, required: true }, 
    workTime: { type: String, required: true }, 
    status:{
      type:String,
      enum: ['active','inactive'],
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
