import mongoose from "mongoose";

const SubscriptionPlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    maxRestaurants: { type: Number, required: true },
    features: [{ type: String }],
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

export const SubscriptionPlanModel = mongoose.model(
  "SubscriptionPlan",
  SubscriptionPlanSchema
);
