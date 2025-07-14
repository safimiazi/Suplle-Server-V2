import mongoose, { Schema, model, Document, Types } from "mongoose";
import { IOwner } from "./owner.interface";

const OwnerSchema = new Schema<IOwner>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    restaurant: [{ type: Schema.Types.ObjectId, ref: "Restaurant" }], // ✅ corrected here
    businessName: { type: String, required: true },
    address: { type: String, required: false },
    businessEmail: { type: String, required: true },
    referralCode: { type: String },
    status: {
      type: String,
      enum: ["pending", "active", "rejected", "unverified"],
      default: "pending",
    },
    taxInfo: {
      gstRate: { type: String, default: "0%" },
      cgstRate: { type: String, default: "0%" },
      sgstRate: { type: String, default: "0%" },
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const OwnerModel = model<IOwner>("Owner", OwnerSchema);
