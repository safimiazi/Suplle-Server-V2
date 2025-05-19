import mongoose from "mongoose";

const SubscriptionPlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    maxRestaurants: { type: Number, required: true },
    features: [{ type: String }],
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const SubscriptionPlanModel = mongoose.model(
  "SubscriptionPlan",
  SubscriptionPlanSchema
);
