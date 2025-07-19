import mongoose from "mongoose";
import { ISubscriptionPlan } from "./SubscriptionPlan.interface";

const SubscriptionPlanSchema = new mongoose.Schema<ISubscriptionPlan>(
  {
    state: {
      type: String,
      enum: ["starter", "pro", "premium", "enterprise"],
      required: true,
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    target: { type: String, require: true },

    maxRestaurants: { type: Number, required: true },  // all plan
    maxFloor: { type: Number, default: null }, // null = unlimited
    maxTables: { type: Number, default: null }, // null = unlimited
    maxMenu: { type: Number, required: true },
    isMenuUploadViaExcel: { type: Boolean }, // for pro plan
    isEccessSubUser: { type: Boolean }, // dine in , takeaway
    features: [{ type: String }],
    maxUsers: { type: Number, required: true },
    maxQRCodes: { type: Number, required: true },
    maxMenuItems: { type: Number, required: true },
    billingCycle: {
      type: String,
      enum: ['monthly', 'yearly'],
      default: 'monthly',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    mostPopular: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);



// 👇 Automatically set unlimited if state is 'pro'
SubscriptionPlanSchema.pre('validate', function (next) {
  if (this.state === 'pro') {
    this.maxFloor = null;
    this.maxTables = null;
  }
  next();
});


export const SubscriptionPlanModel = mongoose.model(
  "SubscriptionPlan",
  SubscriptionPlanSchema
);
