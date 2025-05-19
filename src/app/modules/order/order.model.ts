import { Schema, model, Document, Types } from "mongoose";
import { IOrder } from "./order.interface";

const OrderSchema = new Schema<IOrder>(
  {
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    zone : { type: Schema.Types.ObjectId, ref: "RestaurantZone" ,default:"" },
    menus: [{ type: Types.ObjectId, ref: "Menu", required: true }],
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    orderType: {
      type: String,
      enum: ["dine in", "takeaway"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "inProgress", "delivered", "cancel"],
      default: "pending",
    },
    specialRequest: { type: String, default: "" },
    total: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true, 
    versionKey:false
  }
);

export const OrderModel = model<IOrder>("Order", OrderSchema);
