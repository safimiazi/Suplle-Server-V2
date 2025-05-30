import { Schema, model, Document, Types } from "mongoose";
import { IOrder } from "./order.interface";

const OrderSchema = new Schema<IOrder>(
  {
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    // table: { type: Schema.Types.ObjectId, ref: "Table" ,default:"" },
    table: {
      type: String,
      default: null,
    },
    orderId:{
      type: String,
      required: true,
      unique: true,
      default: () => `ORD-${Date.now().toString(36)}`
    },
    person: { type: Number, default: 1 },
    menus: {
      type: [
        {
          menu: { type: Schema.Types.ObjectId, ref: "Menu", required: true },
          quantity: { type: Number, required: true },
        },
      ],
       
    },
    customerName: { type: String, default:null },
    customerPhone: { type: String, default:null},
    orderType: {
      type: String,
      enum: ["dine in", "takeaway"],
      required: true,
    },
  
    specialRequest: { type: String, default: "" },
    total: { type: Number, default:0},
    paymentMethod: {
      type: {
        type: String,
        enum: ["cash", "card"],
        required: true,
      },
      cardNumber: {
        type: String,
        default: null,
      },
    },
    status: {
      type: String,
      enum: ["pending", "inProgress", "delivered", "cancel"],
      default: "pending",
    },

    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true, 
    versionKey:false
  }
);

export const OrderModel = model<IOrder>("Order", OrderSchema);
