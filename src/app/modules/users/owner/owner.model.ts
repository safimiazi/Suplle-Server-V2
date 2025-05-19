import mongoose, { Schema, model, Document, Types } from "mongoose";
import { IOwner } from "./owner.interface";

const OwnerSchema = new Schema<IOwner>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
    },
    businessName: { type: String, required: true },
    businessEmail: { type: String, required: true },
    referralCode: { type: String },
    status: {
      type: String,
      enum: ["pending", "active", "rejected", "unverified"],
      default: "pending",
    },
    taxInfo: {
      gstRate: { type: String },
      cgstRate: { type: String },
      sgstRate: { type: String },
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
